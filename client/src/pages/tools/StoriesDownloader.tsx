import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function StoriesDownloader() {
  const tool = getToolById("stories")!;
  return <ToolPageLayout tool={tool} />;
}
