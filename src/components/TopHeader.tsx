import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, LogOut } from "lucide-react";

interface TopHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userName: string;
  onLogout: () => void;
}

export function TopHeader({
  sidebarOpen,
  onToggleSidebar,
  userName,
  onLogout,
}: TopHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded hover:bg-green-100 text-green-700"
          type="button"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Sembunyikan menu" : "Tampilkan menu"}
        >
          {sidebarOpen ? (
            <ChevronLeft size={20} strokeWidth={2} />
          ) : (
            <ChevronRight size={20} strokeWidth={2} />
          )}
        </button>
        <div>
          <div className="text-lg font-bold text-green-700">
            Sistem Manajemen Desa Sugihan
          </div>
          <div className="text-sm text-gray-500">
            Kec. Winong, Kab. Pati, Jawa Tengah
          </div>
        </div>
      </div>
      <div className="relative" ref={profileRef}>
        <button
          type="button"
          className="flex items-center gap-2 p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
          onClick={() => setProfileOpen((open) => !open)}
        >
          <span className="profile-avatar">
            <User size={20} />
          </span>
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="font-semibold text-green-700">{userName}</div>
              <div className="text-xs text-gray-500">Operator Sistem</div>
            </div>
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-green-50 text-gray-700"
            >
              Lihat Profil
            </button>
            <div className="px-6 py-4 border-t border-green-200">
              <button
                type="button"
                className="sidebar-logout-btn"
                onClick={onLogout}
              >
                <span className="menu-icon">
                  <LogOut size={14} />
                </span>
                <span className="menu-label">Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
