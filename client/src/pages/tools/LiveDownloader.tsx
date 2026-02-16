import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function LiveDownloader() {
  const tool = getToolById("live")!;
  return <ToolPageLayout tool={tool} />;
}
