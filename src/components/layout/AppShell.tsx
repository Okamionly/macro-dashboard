import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export function AppShell() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
