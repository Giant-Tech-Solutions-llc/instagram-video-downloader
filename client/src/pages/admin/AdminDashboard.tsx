import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Eye, PenTool, Trash2, Users, FolderOpen, Plus } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<{
    totalPosts: number;
    published: number;
    drafts: number;
    trashed: number;
    totalUsers: number;
    totalCategories: number;
  }>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const statCards = [
    { label: "Total Posts", value: stats?.totalPosts ?? 0, icon: FileText, color: "text-blue-400" },
    { label: "Published", value: stats?.published ?? 0, icon: Eye, color: "text-green-400" },
    { label: "Drafts", value: stats?.drafts ?? 0, icon: PenTool, color: "text-yellow-400" },
    { label: "Trashed", value: stats?.trashed ?? 0, icon: Trash2, color: "text-red-400" },
    { label: "Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-purple-400" },
    { label: "Categories", value: stats?.totalCategories ?? 0, icon: FolderOpen, color: "text-pink-400" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm">System overview</p>
          </div>
          <Link href="/admin/posts/create">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white" data-testid="button-new-post">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <Card key={card.label} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-800 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {isLoading ? "..." : card.value}
                  </p>
                  <p className="text-gray-400 text-xs">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/posts/create">
                <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" /> Create New Post
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800">
                  <FolderOpen className="w-4 h-4 mr-2" /> Manage Categories
                </Button>
              </Link>
              <Link href="/admin/media">
                <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800">
                  <FileText className="w-4 h-4 mr-2" /> Manage Media
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-400">
              <div className="flex justify-between"><span>Platform</span><span className="text-white">Baixar Video CMS</span></div>
              <div className="flex justify-between"><span>Version</span><span className="text-white">1.0.0</span></div>
              <div className="flex justify-between"><span>Database</span><span className="text-green-400">Connected</span></div>
              <div className="flex justify-between"><span>Status</span><span className="text-green-400">Operational</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
