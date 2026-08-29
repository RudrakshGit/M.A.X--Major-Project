import { AppHeader, AppTabs } from "@/features/navigation/components/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-surface">
      <AppHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <AppTabs />
    </div>
  );
}
