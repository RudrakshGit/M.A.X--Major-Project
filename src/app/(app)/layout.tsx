import { AppHeader, AppTabs } from "@/features/navigation/components/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-surface overflow-hidden">
      <AppHeader />
      <main className="flex-1 min-h-0 flex flex-col overflow-y-auto">{children}</main>
      <AppTabs />
    </div>
  );
}
