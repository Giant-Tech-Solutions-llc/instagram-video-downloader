import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function PhotoDownloader() {
  const tool = getToolById("foto")!;
  return <ToolPageLayout tool={tool} />;
}
