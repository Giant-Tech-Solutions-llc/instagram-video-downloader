import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function NoWatermarkDownloader() {
  const tool = getToolById("no-watermark")!;
  return <ToolPageLayout tool={tool} />;
}
