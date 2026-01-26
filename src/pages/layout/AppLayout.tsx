import React, { useState, useMemo } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";
const MENU_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  kependudukan: Users,
  persuratan: FileText,
  pengaturan: Settings,
  user: Users,
};
import { TopHeader } from "../../components/TopHeader";
import { Card } from "../../components/ui/card";
import ResidentIndexPage from "../../pages/resident/ResidentIndexPage";
import UserIndexPage from "../../pages/user/UserIndexPage";
import SKTMPage from "../../pages/letter/SKTMPage";

const MENUS = [
  { id: "dashboard", label: "Dashboard", description: "Ringkasan data desa" },
  {
    id: "kependudukan",
    label: "Kependudukan",
    description: "Data penduduk desa",
  },
  { id: "persuratan", label: "Persuratan", description: "Layanan surat desa" },
  { id: "pengaturan", label: "Pengaturan", description: "Pengaturan sistem" },
  { id: "user", label: "Pengguna" },
];

function AppLayout({ onLogout }: { onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentMenu = useMemo(
    () => MENUS.find((m) => location.pathname.includes(m.id)),
    [location.pathname],
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <Sidebar
          menus={MENUS}
          activeMenu={currentMenu?.id || ""}
          onSelectMenu={(menuId) => navigate(`/${menuId}`)}
          onLogout={onLogout}
          menuIcons={MENU_ICONS}
        />
      )}

      <div className="flex-1 flex flex-col">
        <TopHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          userName="Sekretariat Desa Sugihan"
          onLogout={onLogout}
        />

        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="dashboard"
              element={
                <Card title="Dashboard">
                  <p>Ringkasan data desa akan tampil di sini.</p>
                </Card>
              }
            />
            <Route path="kependudukan" element={<ResidentIndexPage />} />
            <Route
              path="persuratan"
              element={
                <Card title="Persuratan">
                  <p>Daftar layanan surat akan tampil di sini.</p>
                </Card>
              }
            />
            <Route
              path="pengaturan"
              element={
                <Card title="Pengaturan">
                  <p>Pengaturan sistem aplikasi.</p>
                </Card>
              }
            />
            <Route path="user" element={<UserIndexPage />} />
            <Route path="sktm" element={<SKTMPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;