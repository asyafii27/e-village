import type { LucideIcon } from "lucide-react";
import { Home } from "lucide-react";

interface SidebarProps {
  menus: { id: string; label: string; description: string }[];
  activeMenu: string;
  onSelectMenu: (id: string) => void;
  onLogout: () => void;
  menuIcons: Record<string, LucideIcon>;
}

export function Sidebar({ menus, activeMenu, onSelectMenu, onLogout, menuIcons, className = "" }: SidebarProps & { className?: string }) {
  return (
    <aside className={`w-64 min-h-screen bg-green-100 border-r border-green-200 flex flex-col ${className}`}>
      <div className="px-6 py-5 border-b border-green-200 flex items-center gap-3">
        <span className="bg-green-200 text-green-700 rounded-full p-2 flex items-center justify-center">
          <Home size={28} />
        </span>
        <div>
          <div className="text-xl font-bold text-green-700 mb-1">Desa Sugihan</div>
          <div className="text-sm text-gray-600">Kec. Winong, Kab. Pati, Jawa Tengah</div>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menus.map((menu) => {
          const Icon = menuIcons[menu.id];
          const active = activeMenu === menu.id;
          return (
            <button
              key={menu.id}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition font-medium text-left gap-2 ${active ? "bg-green-200 text-green-800" : "text-gray-700 hover:bg-green-50"}`}
              onClick={() => onSelectMenu(menu.id)}
            >
              <span className={`menu-icon ${active ? "text-green-700" : "text-gray-500"}`}>{Icon ? <Icon size={20} strokeWidth={2} /> : null}</span>
              <span className="menu-label">{menu.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-green-200">
        <button
          type="button"
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
          onClick={onLogout}
        >
          <span className="menu-icon">⏻</span>
          <span className="menu-label">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
