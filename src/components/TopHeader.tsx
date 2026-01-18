import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

interface TopHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userName: string;
  onLogout: () => void;
}

export function TopHeader({ sidebarOpen, onToggleSidebar, userName, onLogout }: TopHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  return (
    <header className="top-header">
      <div className="top-header-left">
        <button
          className="top-header-toggle"
          type="button"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Sembunyikan menu" : "Tampilkan menu"}
        >
          <span className="toggle-icon">
            {sidebarOpen ? (
              <ChevronLeft size={18} strokeWidth={1.8} />
            ) : (
              <ChevronRight size={18} strokeWidth={1.8} />
            )}
          </span>
        </button>
        <div className="top-header-title">
          <div className="top-village-name">Sistem Manajemen Desa Sugihan</div>
          <div className="top-village-meta">Kec. Winong, Kab. Pati, Jawa Tengah</div>
        </div>
      </div>
      <div className="top-header-right">
        <div className="profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className="profile-trigger"
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span className="profile-avatar">
              <User size={18} />
            </span>
          </button>
          {profileOpen && (
            <div className="profile-menu">
              <div className="profile-info">
                <div className="profile-name">{userName}</div>
                <div className="profile-role">Operator Sistem</div>
              </div>
              <button type="button" className="profile-menu-item">
                Lihat Profil
              </button>
              <button
                type="button"
                className="profile-menu-item profile-menu-logout"
                onClick={onLogout}
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
