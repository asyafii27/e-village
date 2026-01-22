import { useState, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LoginPage } from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SKTMPage from "./pages/letter/SKTMPage";
import UserIndexPage from "./pages/user/UserIndexPage";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { Card } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

import type { LucideIcon } from "lucide-react";
import {
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

const MENUS = [
  { id: "dashboard", label: "Dashboard", description: "Ringkasan data desa" },
  {
    id: "kependudukan",
    label: "Kependudukan",
    description: "Data penduduk desa",
  },
  { id: "persuratan", label: "Persuratan", description: "Layanan surat desa" },
  { id: "pengaturan", label: "Pengaturan", description: "Pengaturan sistem" },
  { id: "user", label: "Pengguna"},
];

const MENU_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  kependudukan: Users,
  persuratan: FileText,
  pengaturan: Settings,
  user: Users,
};

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
          {/* <header className="mb-6">
            <h1 className="text-2xl font-bold text-green-700">
              {currentMenu?.label}
            </h1>
            <p className="text-gray-600">{currentMenu?.description}</p>
          </header> */}

          {/* CONTENT */}
          <Routes>
            <Route
              path="dashboard"
              element={
                <Card title="Dashboard">
                  <p>Ringkasan data desa akan tampil di sini.</p>
                </Card>
              }
            />
            <Route
              path="kependudukan"
              element={
                <Card title="Data Warga">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>NIK</TableHead>
                        <TableHead>Gender</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Contoh Warga</TableCell>
                        <TableCell>3378xxxxxxxx</TableCell>
                        <TableCell>L</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              }
            />
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
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<UserIndexPage />} />
          <Route path="/persuratan" element={<SKTMPage />} />

          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <AppLayout onLogout={() => setIsLoggedIn(false)} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={6000} />
    </>
  );
}
