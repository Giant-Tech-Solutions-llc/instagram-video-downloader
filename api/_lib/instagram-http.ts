import axios, { type AxiosRequestConfig } from "axios";

const DESKTOP_FINGERPRINTS = [
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    sec_ch_ua: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    sec_ch_ua_platform: '"Windows"',
    sec_ch_ua_mobile: '?0',
  },
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    sec_ch_ua: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    sec_ch_ua_platform: '"macOS"',
    sec_ch_ua_mobile: '?0',
  },
  {
    ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    sec_ch_ua: '"Chromium";v="121", "Not A;Brand";v="99", "Google Chrome";v="121"',
    sec_ch_ua_platform: '"Linux"',
    sec_ch_ua_mobile: '?0',
  },
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
    sec_ch_ua: null,
    sec_ch_ua_platform: null,
    sec_ch_ua_mobile: null,
  },
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
    sec_ch_ua: null,
    sec_ch_ua_platform: null,
    sec_ch_ua_mobile: null,
  },
];

const MOBILE_FINGERPRINTS = [
  {
    ua: 'Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; samsung; SM-G991B; o1s; exynos2100; en_US; 458229258)',
  },
  {
    ua: 'Instagram 269.0.0.18.75 Android (31/12; 420dpi; 1080x2400; samsung; SM-G998B; p3q; exynos2100; en_US; 435574786)',
  },
  {
    ua: 'Instagram 261.0.0.21.111 (iPhone14,2; iOS 16_1; en_US; en-US; scale=3.00; 1170x2532; 401691830) AppleWebKit/420+',
  },
];

const ACCEPT_LANGUAGES = [
  'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'en-US,en;q=0.9',
  'en-US,en;q=0.9,pt-BR;q=0.8',
  'en-GB,en;q=0.9,en-US;q=0.8',
];

const IG_APP_ID = '936619743392459';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildSessionCookies(): string {
  const sessionId = process.env.IG_SESSION_ID;
  if (!sessionId) return '';

  const parts = [`sessionid=${sessionId}`];
  if (process.env.IG_CSRF_TOKEN) parts.push(`csrftoken=${process.env.IG_CSRF_TOKEN}`);
  if (process.env.IG_DS_USER_ID) parts.push(`ds_user_id=${process.env.IG_DS_USER_ID}`);
  parts.push('ig_did=; ig_nrcb=1');
  return parts.join('; ');
}

export function hasSessionAuth(): boolean {
  return !!process.env.IG_SESSION_ID;
}

export function jitterDelay(baseMs: number, varianceMs?: number): Promise<void> {
  const v = varianceMs ?? baseMs * 0.5;
  const delay = baseMs + (Math.random() - 0.5) * 2 * v;
  return new Promise(resolve => setTimeout(resolve, Math.max(50, delay)));
}

interface RequestOptions {
  useMobile?: boolean;
  useAuth?: boolean;
  isApiCall?: boolean;
  timeout?: number;
  extraHeaders?: Record<string, string>;
}

export async function makeInstagramRequest(url: string, options: RequestOptions = {}) {
  const { useMobile = false, useAuth = true, isApiCall = false, timeout = 15000, extraHeaders = {} } = options;

  const fp = useMobile ? pick(MOBILE_FINGERPRINTS) : pick(DESKTOP_FINGERPRINTS);
  const cookies = useAuth ? buildSessionCookies() : '';

  const headers: Record<string, string> = {
    'User-Agent': fp.ua,
    'Accept-Language': pick(ACCEPT_LANGUAGES),
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://www.instagram.com',
    'Referer': 'https://www.instagram.com/',
  };

  if (useMobile) {
    headers['Accept'] = '*/*';
  } else {
    headers['Accept'] = isApiCall
      ? '*/*'
      : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8';

    const desktopFp = fp as typeof DESKTOP_FINGERPRINTS[0];
    if (desktopFp.sec_ch_ua) {
      headers['Sec-Ch-Ua'] = desktopFp.sec_ch_ua;
      headers['Sec-Ch-Ua-Mobile'] = desktopFp.sec_ch_ua_mobile!;
      headers['Sec-Ch-Ua-Platform'] = desktopFp.sec_ch_ua_platform!;
    }

    if (!isApiCall) {
      headers['Sec-Fetch-Dest'] = 'document';
      headers['Sec-Fetch-Mode'] = 'navigate';
      headers['Sec-Fetch-Site'] = 'none';
      headers['Sec-Fetch-User'] = '?1';
      headers['Upgrade-Insecure-Requests'] = '1';
    } else {
      headers['Sec-Fetch-Dest'] = 'empty';
      headers['Sec-Fetch-Mode'] = 'cors';
      headers['Sec-Fetch-Site'] = 'same-origin';
    }
  }

  if (isApiCall || useAuth) {
    headers['X-IG-App-ID'] = IG_APP_ID;
    headers['X-Requested-With'] = 'XMLHttpRequest';
    if (process.env.IG_CSRF_TOKEN) {
      headers['X-CSRFToken'] = process.env.IG_CSRF_TOKEN;
    }
  }

  if (cookies) {
    headers['Cookie'] = cookies;
  }

  Object.assign(headers, extraHeaders);

  const config: AxiosRequestConfig = {
    headers,
    timeout,
    maxRedirects: 5,
  };

  return axios.get(url, config);
}
