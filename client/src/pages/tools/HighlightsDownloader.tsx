import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function HighlightsDownloader() {
  const tool = getToolById("highlights")!;
  return <ToolPageLayout tool={tool} />;
}
