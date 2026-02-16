import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function CarouselDownloader() {
  const tool = getToolById("carousel")!;
  return <ToolPageLayout tool={tool} />;
}
