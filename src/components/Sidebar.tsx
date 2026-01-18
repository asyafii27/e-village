import type { LucideIcon } from "lucide-react";
import {
  Home,
  LogOut,
  LayoutDashboard,
  Users,
  FileText,
  Map,
  Wallet,
  Hammer,
  HeartPulse,
  Store,
  MessageCircle,
  Archive,
  Settings,
} from "lucide-react";

interface SidebarProps {
  menus: { id: string; label: string; description: string }[];
  activeMenu: string;
  onSelectMenu: (id: string) => void;
  onLogout: () => void;
  menuIcons: Record<string, LucideIcon>;
}

export function Sidebar({
  menus,
  activeMenu,
  onSelectMenu,
  onLogout,
  menuIcons,
  className = "",
}: SidebarProps & { className?: string }) {
  return (
    <aside
      className={`w-64 min-h-screen bg-green-100 border-r border-green-200 flex flex-col ${className}`}
    >
      <div className="px-6 py-5 border-b border-green-200 flex items-center gap-3">
        <span className="bg-green-200 text-green-700 rounded-full p-2 flex items-center justify-center">
          <Home size={28} />
        </span>
        <div>
          <div className="text-xl font-bold text-green-700 mb-1">
            Desa Sugihan
          </div>
          <div className="text-sm text-gray-600">
            Kec. Winong, Kab. Pati, Jawa Tengah
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menus.map((menu) => {
          console.log(
            "Rendering menu:",
            menu.id,
            "Icon exists:",
            menuIcons.hasOwnProperty(menu.id)
          ); // Debugging log
          return (
            <button
              key={menu.id}
              type="button"
              className={`sidebar-menu-item ${
                activeMenu === menu.id ? "active" : ""
              }`}
              onClick={() => onSelectMenu(menu.id)}
            >
              <span className="menu-icon">
                {(() => {
                  const Icon = menuIcons[menu.id];
                  return Icon ? <Icon size={18} /> : null;
                })()}
              </span>
              <span className="menu-label">{menu.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-green-200">
        <button type="button" className="sidebar-logout-btn" onClick={onLogout}>
          <span className="menu-icon">
            <LogOut size={18} />
          </span>
          <span className="menu-label">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
