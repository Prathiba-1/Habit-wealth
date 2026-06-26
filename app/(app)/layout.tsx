import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg-0 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-48 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto pt-[52px]">
          <div className="p-5 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
