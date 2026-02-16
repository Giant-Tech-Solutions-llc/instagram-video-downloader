import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function ReelsDownloader() {
  const tool = getToolById("reels")!;
  return <ToolPageLayout tool={tool} />;
}
