export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Top Navbar will be placed here */}
      <nav className="border-b bg-background px-6 py-3">
        <span className="text-lg font-semibold">PBMS</span>
      </nav>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
