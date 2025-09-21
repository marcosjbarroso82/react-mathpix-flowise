import { Outlet } from "react-router";
import { BottomNavigation } from "./BottomNavigation";
import { PWAUpdater } from "./PWAUpdater";
import { UIToggles } from "./UIToggles";

export function AppLayout() {
  return (
    <div className="min-h-screen main-content" style={{ backgroundColor: 'var(--color-background)' }}>
      <Outlet />
      <BottomNavigation />
      <PWAUpdater />
      <UIToggles />
    </div>
  );
}
