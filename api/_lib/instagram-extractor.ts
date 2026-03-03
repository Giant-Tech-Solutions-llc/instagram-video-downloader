import * as cheerio from "cheerio";
import { makeInstagramRequest, hasSessionAuth, jitterDelay } from "./instagram-http";

export interface MediaItem {
  url: string;
  thumbnail?: string;
  type: 'video' | 'image';
}

export function extractShortcode(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reels\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/stories\/[^/]+\/(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractUsername(url: string): string | null {
  const match = url.match(/instagram\.com\/([A-Za-z0-9_.]+)\/?(\?|$)/);
  return match ? match[1] : null;
}

export function cleanInstagramUrl(rawUrl: string): string {
  return rawUrl
    .replace(/\\\\\//g, '/')
    .replace(/\\\//g, '/')
    .replace(/\\u0026/g, '&')
    .replace(/\\u00253D/g, '%3D')
    .replace(/&amp;/g, '&');
}

export function shortcodeToMediaId(shortcode: string): string | null {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let id = BigInt(0);
  for (const char of shortcode) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) return null;
    id = id * BigInt(64) + BigInt(idx);
  }
  return id.toString();
}

export function findVideoUrlsInText(text: string): string[] {
  const urls: string[] = [];
  const patterns = [
    /video_url\\?":\\?"(https?:[^"\\]*(?:\\.[^"\\]*)*)/g,
    /"video_url"\s*:\s*"([^"]+)"/g,
    /"contentUrl"\s*:\s*"([^"]+\.mp4[^"]*)"/g,
    /(?:src|url)\\?"?:\s*\\?"?(https?:\/\/[^\s"\\]*\.mp4[^\s"\\]*)/g,
    /"video_versions"\s*:\s*\[\s*\{\s*[^}]*"url"\s*:\s*"([^"]+)"/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        const cleaned = cleanInstagramUrl(match[1]);
        if (cleaned.includes('cdninstagram.com') || cleaned.includes('fbcdn.net')) {
          urls.push(cleaned);
        }
      }
    }
  }
  return urls;
}

export function parseMediaItems(items: any[]): MediaItem[] {
  const results: MediaItem[] = [];
  for (const item of items) {
    if (item.carousel_media) {
      for (const media of item.carousel_media) {
        if (media.video_versions && media.video_versions.length > 0) {
          const sorted = [...media.video_versions].sort((a: any, b: any) => (b.height || 0) - (a.height || 0));
          results.push({
            url: sorted[0].url,
            thumbnail: media.image_versions2?.candidates?.[0]?.url,
            type: 'video',
          });
        } else if (media.image_versions2?.candidates?.length > 0) {
          results.push({
            url: media.image_versions2.candidates[0].url,
            type: 'image',
          });
        }
      }
    } else if (item.video_versions && item.video_versions.length > 0) {
      const sorted = [...item.video_versions].sort((a: any, b: any) => (b.height || 0) - (a.height || 0));
      results.push({
        url: sorted[0].url,
        thumbnail: item.image_versions2?.candidates?.[0]?.url,
        type: 'video',
      });
    } else if (item.image_versions2?.candidates?.length > 0) {
      results.push({
        url: item.image_versions2.candidates[0].url,
        type: 'image',
      });
    }
  }
  return results;
}

export function parseGraphQLMedia(data: any): MediaItem[] {
  const items: MediaItem[] = [];
  if (data.__typename === 'GraphSidecar' && data.edge_sidecar_to_children?.edges) {
    for (const edge of data.edge_sidecar_to_children.edges) {
      const node = edge.node;
      if (node.is_video && node.video_url) {
        items.push({ url: node.video_url, thumbnail: node.display_url, type: 'video' });
      } else if (node.display_url) {
        items.push({ url: node.display_url, type: 'image' });
      }
    }
  } else if (data.is_video && data.video_url) {
    items.push({ url: data.video_url, thumbnail: data.display_url, type: 'video' });
  } else if (data.display_url) {
    items.push({ url: data.display_url, type: 'image' });
  }
  return items;
}

export async function tryEmbedExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  try {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const response = await makeInstagramRequest(embedUrl, { useAuth: false });

    const html = response.data;
    const $ = cheerio.load(html);
    const items: MediaItem[] = [];

    const videoSrc = $('video source').attr('src') || $('video').attr('src');
    if (videoSrc) {
      const posterSrc = $('video').attr('poster') || $('img.EmbeddedMediaImage').attr('src');
      items.push({ url: videoSrc, thumbnail: posterSrc || undefined, type: 'video' });
    }

    if (!items.some(i => i.type === 'video')) {
      const ogVideo = $('meta[property="og:video"]').attr('content') ||
                      $('meta[property="og:video:secure_url"]').attr('content');
      if (ogVideo) {
        const cleanedOgVideo = cleanInstagramUrl(ogVideo);
        if (cleanedOgVideo.includes('cdninstagram.com') || cleanedOgVideo.includes('fbcdn.net')) {
          items.length = 0;
          items.push({ url: cleanedOgVideo, type: 'video' });
        }
      }
    }

    if (!items.some(i => i.type === 'video')) {
      const videoUrls = findVideoUrlsInText(html);
      if (videoUrls.length > 0) {
        items.length = 0;
        items.push({ url: videoUrls[0], type: 'video' });
      }
    }

    if (!items.some(i => i.type === 'video')) {
      const mp4Matches = html.match(/https?:\/\/[^\s"'\\]*\.mp4[^\s"'\\]*/g);
      if (mp4Matches) {
        for (const rawUrl of mp4Matches) {
          const cleaned = cleanInstagramUrl(rawUrl);
          if (cleaned.includes('cdninstagram.com') || cleaned.includes('fbcdn.net')) {
            items.length = 0;
            items.push({ url: cleaned, type: 'video' });
            break;
          }
        }
      }
    }

    if (items.length === 0) {
      const imgSrc = $('img.EmbeddedMediaImage').attr('src') ||
                     $('img[srcset]').first().attr('src') ||
                     $('img').filter((_, el) => {
                       const src = $(el).attr('src') || '';
                       return src.includes('cdninstagram') || src.includes('fbcdn');
                     }).first().attr('src');
      if (imgSrc) {
        items.push({ url: imgSrc, type: 'image' });
      }
    }

    if (items.length === 0) {
      const displayMatch = html.match(/display_url\\?":\\?"(https?:.*?)(?:\\?"|$)/);
      if (displayMatch && displayMatch[1]) {
        items.push({ url: cleanInstagramUrl(displayMatch[1]), type: 'image' });
      }
    }

    if (!items.some(i => i.type === 'video')) {
      console.log('Embed: no video_url found. HTML contains video_url:', html.includes('video_url'),
        '| .mp4:', html.includes('.mp4'),
        '| video tag:', html.includes('<video'),
        '| HTML length:', html.length);
    }

    return items;
  } catch (e: any) {
    console.log('Embed extraction failed:', e.message);
    return [];
  }
}

export async function tryDirectPageExtraction(url: string): Promise<MediaItem[]> {
  try {
    const response = await makeInstagramRequest(url);

    const html = typeof response.data === 'string' ? response.data : '';
    if (!html) return [];

    const $ = cheerio.load(html);
    const items: MediaItem[] = [];

    const additionalMatch = html.match(/window\.__additionalDataLoaded\s*\(\s*'[^']*'\s*,\s*(\{.+?\})\s*\)/s);
    if (additionalMatch) {
      try {
        const data = JSON.parse(additionalMatch[1]);
        const mediaItem = data?.items?.[0] || data?.graphql?.shortcode_media;
        if (mediaItem) {
          if (data?.items?.[0]) {
            return parseMediaItems(data.items);
          }
          return parseGraphQLMedia(mediaItem);
        }
      } catch {}
    }

    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*(\{.+?\});\s*<\/script>/s);
    if (sharedDataMatch) {
      try {
        const shared = JSON.parse(sharedDataMatch[1]);
        const media = shared?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media;
        if (media) return parseGraphQLMedia(media);
      } catch {}
    }

    let videoUrl = $('meta[property="og:video"]').attr('content') ||
                   $('meta[property="og:video:secure_url"]').attr('content');
    const imageUrl = $('meta[property="og:image"]').attr('content');

    if (videoUrl) {
      items.push({ url: videoUrl, thumbnail: imageUrl || undefined, type: 'video' });
    } else if (imageUrl) {
      items.push({ url: imageUrl, type: 'image' });
    }

    if (items.length === 0) {
      const videoUrls = findVideoUrlsInText(html);
      if (videoUrls.length > 0) {
        items.push({ url: videoUrls[0], type: 'video' });
      }
    }

    if (items.length === 0) {
      const scripts = $('script').map((_, el) => $(el).html()).get();
      for (const scriptContent of scripts) {
        if (!scriptContent) continue;

        const videoUrls = findVideoUrlsInText(scriptContent);
        if (videoUrls.length > 0) {
          items.push({ url: videoUrls[0], type: 'video' });
          break;
        }
      }
    }

    if (items.length === 0) {
      const scripts = $('script').map((_, el) => $(el).html()).get();
      for (const scriptContent of scripts) {
        if (!scriptContent) continue;

        const displayMatch = scriptContent.match(/"display_url"\s*:\s*"([^"]+)"/);
        if (displayMatch && displayMatch[1]) {
          items.push({ url: cleanInstagramUrl(displayMatch[1]), type: 'image' });
          break;
        }
      }
    }

    return items;
  } catch (e: any) {
    console.log('Direct page extraction failed:', e.message);
    return [];
  }
}

export async function tryGraphQLExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  const hashes = [
    'b3055c01b4b222b8a47dc12b090e4e64',
    '2b0673e0dc4580674a88d2953fe1a16a',
  ];

  for (const hash of hashes) {
    try {
      const variables = JSON.stringify({ shortcode, child_comment_count: 3, fetch_comment_count: 40, parent_comment_count: 0, has_threaded_comments: false });
      const graphqlUrl = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables=${encodeURIComponent(variables)}`;
      const response = await makeInstagramRequest(graphqlUrl, { isApiCall: true });

      const data = response.data?.data?.shortcode_media || response.data?.data?.xdt_shortcode_media;
      if (data) return parseGraphQLMedia(data);
    } catch (e: any) {
      console.log(`GraphQL hash ${hash.slice(0, 8)} failed:`, e.message);
    }
  }

  return [];
}

export async function tryJsonApiExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  try {
    const apiUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
    const response = await makeInstagramRequest(apiUrl, { isApiCall: true });

    const body = response.data;
    if (body?.items?.[0]) {
      return parseMediaItems(body.items);
    }
    if (body?.graphql?.shortcode_media) {
      return parseGraphQLMedia(body.graphql.shortcode_media);
    }
    if (body?.data?.shortcode_media) {
      return parseGraphQLMedia(body.data.shortcode_media);
    }

    return [];
  } catch (e: any) {
    console.log('JSON API extraction failed:', e.message);
    return [];
  }
}

export async function tryProfilePictureExtraction(url: string): Promise<MediaItem[]> {
  const username = extractUsername(url);
  if (!username) return [];

  try {
    const response = await makeInstagramRequest(`https://www.instagram.com/${username}/`);

    const html = response.data;
    const $ = cheerio.load(html);

    let profilePicUrl = $('meta[property="og:image"]').attr('content');

    if (!profilePicUrl) {
      const hdMatch = html.match(/"profile_pic_url_hd"\s*:\s*"([^"]+)"/);
      if (hdMatch) {
        profilePicUrl = hdMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
      }
    }

    if (!profilePicUrl) {
      const picMatch = html.match(/"profile_pic_url"\s*:\s*"([^"]+)"/);
      if (picMatch) {
        profilePicUrl = picMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
      }
    }

    if (profilePicUrl) {
      const hdUrl = profilePicUrl
        .replace(/\/s150x150\//, '/s1080x1080/')
        .replace(/\/s320x320\//, '/s1080x1080/')
        .replace(/\/s640x640\//, '/s1080x1080/');
      return [{ url: hdUrl, thumbnail: profilePicUrl, type: 'image' }];
    }

    return [];
  } catch (e: any) {
    console.log('Profile picture extraction failed:', e.message);
    return [];
  }
}

export async function tryMediaInfoExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  const mediaId = shortcodeToMediaId(shortcode);
  if (!mediaId) return [];

  try {
    const apiUrl = `https://www.instagram.com/api/v1/media/${mediaId}/info/`;
    const response = await makeInstagramRequest(apiUrl, { useMobile: true, isApiCall: true });

    const items = response.data?.items;
    if (!items || items.length === 0) return [];

    return parseMediaItems(items);
  } catch (e: any) {
    console.log('Media info extraction failed:', e.message);
    return [];
  }
}

export async function tryAlternateEmbedExtraction(url: string): Promise<MediaItem[]> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return [];

  try {
    const response = await makeInstagramRequest(`https://www.instagram.com/p/${shortcode}/embed/`, {
      useAuth: false,
      extraHeaders: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    const html = response.data;
    const items: MediaItem[] = [];

    const videoUrls = findVideoUrlsInText(html);
    if (videoUrls.length > 0) {
      items.push({ url: videoUrls[0], type: 'video' });
    }

    if (!items.some(i => i.type === 'video')) {
      const mp4Matches = html.match(/https?:\/\/[^\s"'\\]*\.mp4[^\s"'\\]*/g);
      if (mp4Matches) {
        for (const rawUrl of mp4Matches) {
          const cleaned = cleanInstagramUrl(rawUrl);
          if (cleaned.includes('cdninstagram.com') || cleaned.includes('fbcdn.net')) {
            items.length = 0;
            items.push({ url: cleaned, type: 'video' });
            break;
          }
        }
      }
    }

    if (items.length === 0) {
      const $ = cheerio.load(html);
      const videoSrc = $('video').attr('src') || $('video source').attr('src');
      if (videoSrc) {
        items.push({ url: videoSrc, type: 'video' });
      }
    }

    if (items.length === 0) {
      const displayMatch = html.match(/display_url\\?":\\?"(https?:.*?)(?:\\?"|$)/);
      if (displayMatch && displayMatch[1]) {
        items.push({ url: cleanInstagramUrl(displayMatch[1]), type: 'image' });
      }
    }

    if (items.length === 0) {
      const $ = cheerio.load(html);
      $('img').each((_, el) => {
        const src = $(el).attr('src') || '';
        if ((src.includes('cdninstagram') || src.includes('fbcdn')) && !src.includes('s150x150') && !src.includes('emoji')) {
          items.push({ url: src, type: 'image' });
        }
      });
    }

    return items;
  } catch (e: any) {
    console.log('Alternate embed extraction failed:', e.message);
    return [];
  }
}

export function getErrorMessage(toolType?: string): string {
  const messages: Record<string, string> = {
    'stories': 'Não foi possível acessar o Story. Verifique se o perfil é público e se o Story ainda está disponível (Stories expiram em 24h).',
    'private': 'Conteúdo privado não pôde ser acessado. Nossa ferramenta só consegue processar links de conteúdo público ou links diretos de mídia.',
    'profile-picture': 'Não foi possível encontrar a foto de perfil. Verifique se o nome de usuário está correto e se o perfil existe.',
  };
  return messages[toolType || ''] || 'Não foi possível encontrar a mídia. Verifique se o link está correto e se o perfil é público. O Instagram pode estar bloqueando temporariamente, tente novamente em alguns minutos.';
}

export async function extractMedia(url: string, toolType: string): Promise<{ items: MediaItem[]; warning?: string }> {
  const authenticated = hasSessionAuth();
  console.log(`Processing download for URL: ${url} (tool: ${toolType}, auth: ${authenticated})`);

  let allItems: MediaItem[] = [];
  const isReelUrl = /\/reel(s)?\//.test(url);
  const expectsVideo = isReelUrl || toolType === 'video' || toolType === 'reels' || toolType === 'audio';

  if (toolType === 'profile-picture') {
    allItems = await tryProfilePictureExtraction(url);
    if (allItems.length === 0) {
      allItems = await tryDirectPageExtraction(url);
    }
  } else {
    const strategies: { name: string; fn: () => Promise<MediaItem[]> }[] = [];

    if (authenticated) {
      strategies.push(
        { name: 'JSON API extraction', fn: () => tryJsonApiExtraction(url) },
        { name: 'Media info API', fn: () => tryMediaInfoExtraction(url) },
        { name: 'GraphQL extraction', fn: () => tryGraphQLExtraction(url) },
      );
    }
    strategies.push(
      { name: 'Direct page extraction', fn: () => tryDirectPageExtraction(url) },
      { name: 'Embed extraction', fn: () => tryEmbedExtraction(url) },
      { name: 'Alternate embed extraction', fn: () => tryAlternateEmbedExtraction(url) },
    );

    if (isReelUrl) {
      const reelUrl = url.replace('/reel/', '/p/').replace('/reels/', '/p/');
      strategies.push({ name: 'Reel URL variant', fn: () => tryEmbedExtraction(reelUrl) });
    }

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      console.log(`Strategy ${i + 1}: ${strategy.name}...`);
      allItems = await strategy.fn();

      if (allItems.length > 0) {
        const hasVideo = allItems.some(item => item.type === 'video');
        if (expectsVideo && !hasVideo) {
          console.log(`Strategy ${i + 1} returned only images for a video URL, trying next...`);
          if (i < strategies.length - 1) await jitterDelay(300, 150);
          continue;
        }
        console.log(`Strategy ${i + 1} succeeded with ${allItems.length} item(s)`);
        break;
      }
      if (i < strategies.length - 1) await jitterDelay(400, 200);
    }

    if (allItems.length === 0 && expectsVideo) {
      console.log('All video strategies failed, retrying for any media...');
      for (const strategy of strategies) {
        allItems = await strategy.fn();
        if (allItems.length > 0) break;
      }
    }

    if (expectsVideo && allItems.length > 0 && !allItems.some(i => i.type === 'video')) {
      console.log(`WARNING: Could not extract video for reel/video URL: ${url} - returning cover image instead`);
    }
  }

  const videoFallback = expectsVideo && allItems.length > 0 && !allItems.some(i => i.type === 'video');

  return {
    items: allItems,
    ...(videoFallback && { warning: 'video_not_found' }),
  };
}
