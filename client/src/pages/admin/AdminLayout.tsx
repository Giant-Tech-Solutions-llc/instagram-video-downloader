import { useLocation, Link } from "wouter";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Image,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/posts/trash", label: "Trash", icon: Trash2 },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
  { href: "/admin/profile", label: "Profile", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAdminAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/admin" className="text-white font-bold text-lg">
            CMS Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            if (item.href === "/admin/users" && user.role !== "super_admin") return null;
            if (item.href === "/admin/audit-logs" && user.role !== "super_admin") return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-pink-600/20 text-pink-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{user.name}</p>
              <p className="text-gray-500 text-xs truncate">{user.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full text-gray-400 hover:text-white hover:bg-gray-800 justify-start"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
            data-testid="button-menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-gray-400 text-sm hidden sm:block">
            Baixar Video Instagram - Administration Panel
          </div>
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-300">
            &larr; Back to site
          </Link>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
