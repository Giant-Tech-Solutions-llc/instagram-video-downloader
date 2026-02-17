import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function IGTVDownloader() {
  const tool = getToolById("igtv")!;
  return <ToolPageLayout tool={tool} />;
}
