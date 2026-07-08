export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be placed here */}
      <div className="flex flex-1 flex-col">
        {/* Header will be placed here */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
