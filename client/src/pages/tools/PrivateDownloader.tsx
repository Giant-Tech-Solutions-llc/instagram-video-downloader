import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function PrivateDownloader() {
  const tool = getToolById("private")!;
  return <ToolPageLayout tool={tool} />;
}
