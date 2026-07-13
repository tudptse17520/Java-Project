import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Cố định bên trái, ẩn trên mobile */}
      <Sidebar />

      {/* Main Area - Phần còn lại bên phải */}
      <div className="flex flex-1 flex-col overflow-hidden md:pl-64">
        {/* Topbar */}
        <Topbar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
