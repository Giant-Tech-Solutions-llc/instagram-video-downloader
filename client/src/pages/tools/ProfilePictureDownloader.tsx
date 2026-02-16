import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/tools-config";

export default function ProfilePictureDownloader() {
  const tool = getToolById("profile-picture")!;
  return <ToolPageLayout tool={tool} />;
}
