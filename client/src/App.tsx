import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import TermsOfUse from "@/pages/TermsOfUse";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Contact from "@/pages/Contact";
import ComoFunciona from "@/pages/ComoFunciona";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/not-found";
import ReelsDownloader from "@/pages/tools/ReelsDownloader";
import StoriesDownloader from "@/pages/tools/StoriesDownloader";
import PhotoDownloader from "@/pages/tools/PhotoDownloader";
import ProfilePictureDownloader from "@/pages/tools/ProfilePictureDownloader";
import AudioExtractor from "@/pages/tools/AudioExtractor";
import HighlightsDownloader from "@/pages/tools/HighlightsDownloader";
import CarouselDownloader from "@/pages/tools/CarouselDownloader";
import PrivateDownloader from "@/pages/tools/PrivateDownloader";
import HD4KDownloader from "@/pages/tools/HD4KDownloader";
import NoWatermarkDownloader from "@/pages/tools/NoWatermarkDownloader";
import IGTVDownloader from "@/pages/tools/IGTVDownloader";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/baixar-reels-instagram" component={ReelsDownloader} />
      <Route path="/baixar-stories-instagram" component={StoriesDownloader} />
      <Route path="/baixar-fotos-instagram" component={PhotoDownloader} />
      <Route path="/baixar-foto-perfil-instagram" component={ProfilePictureDownloader} />
      <Route path="/extrair-audio-instagram" component={AudioExtractor} />
      <Route path="/baixar-destaques-instagram" component={HighlightsDownloader} />
      <Route path="/baixar-carrossel-instagram" component={CarouselDownloader} />
      <Route path="/baixar-conteudo-privado-instagram" component={PrivateDownloader} />
      <Route path="/baixar-hd-4k-instagram" component={HD4KDownloader} />
      <Route path="/baixar-sem-marca-dagua-instagram" component={NoWatermarkDownloader} />
      <Route path="/baixar-igtv-instagram" component={IGTVDownloader} />
      <Route path="/termos" component={TermsOfUse} />
      <Route path="/privacidade" component={PrivacyPolicy} />
      <Route path="/contato" component={Contact} />
      <Route path="/como-funciona" component={ComoFunciona} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
