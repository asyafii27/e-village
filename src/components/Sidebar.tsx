import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  menus: { id: string; label: string; description: string }[];
  activeMenu: string;
  onSelectMenu: (id: string) => void;
  onLogout: () => void;
  menuIcons: Record<string, LucideIcon>;
}

export function Sidebar({ menus, activeMenu, onSelectMenu, onLogout, menuIcons, className = "" }: SidebarProps & { className?: string }) {
  return (
    <aside className={"sidebar " + className}>
      <div className="sidebar-header">
        <div className="village-name">Desa Sugihan</div>
        <div className="village-meta">Kec. Winong, Kab. Pati, Jawa Tengah</div>
      </div>
      <nav className="sidebar-menu">
        {menus.map((menu) => {
          const Icon = menuIcons[menu.id];
          return (
            <button
              key={menu.id}
              className={
                "sidebar-item" +
                (activeMenu === menu.id ? " sidebar-item-active" : "")
              }
              onClick={() => onSelectMenu(menu.id)}
            >
              <span className="menu-icon">{Icon ? <Icon size={18} strokeWidth={1.8} /> : null}</span>
              <span className="menu-label">{menu.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          <span className="menu-icon">⏻</span>
          <span className="menu-label">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
