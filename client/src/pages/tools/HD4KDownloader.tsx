import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function HD4KDownloader() {
  const tool = getToolById("hd4k")!;
  return <ToolPageLayout tool={tool} />;
}
