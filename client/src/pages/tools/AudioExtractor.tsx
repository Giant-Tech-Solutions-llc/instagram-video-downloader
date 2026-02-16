import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function AudioExtractor() {
  const tool = getToolById("audio")!;
  return <ToolPageLayout tool={tool} />;
}
