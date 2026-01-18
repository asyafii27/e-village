import { useState } from "react";
import "./style.css";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Select } from "./components/ui/select";
import { DatePicker } from "./components/ui/date-picker";
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



const MENUS: { id: string; label: string; description: string }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Ringkasan data dan aktivitas utama Desa Sugihan.",
  },
  {
    id: "kependudukan",
    label: "Administrasi Kependudukan",
    description: "Data penduduk, KK, dan mutasi warga.",
  },
  {
    id: "persuratan",
    label: "Layanan Persuratan",
    description: "Pengajuan dan arsip surat keterangan desa.",
  },
  {
    id: "data-desa",
    label: "Data Desa",
    description: "Profil Desa Sugihan, fasilitas umum, dan lembaga desa.",
  },
  {
    id: "keuangan",
    label: "Keuangan & APBDes",
    description: "Rencana dan realisasi anggaran desa.",
  },
  {
    id: "pembangunan",
    label: "Pembangunan & Infrastruktur",
    description: "Perencanaan dan monitoring kegiatan pembangunan.",
  },
  {
    id: "sosial",
    label: "Layanan Sosial & Kesehatan",
    description: "Data bantuan sosial dan kegiatan kesehatan desa.",
  },
  {
    id: "umkm",
    label: "UMKM & Ekonomi Desa",
    description: "Data UMKM dan produk unggulan Desa Sugihan.",
  },
  {
    id: "aduan",
    label: "Aduan & Aspirasi Warga",
    description: "Penyaluran aduan dan aspirasi masyarakat.",
  },
  {
    id: "arsip",
    label: "Laporan & Arsip",
    description: "Laporan berkala dan arsip dokumen desa.",
  },
  {
    id: "pengaturan",
    label: "Pengaturan Sistem",
    description: "Pengelolaan pengguna, nomor surat, dan konfigurasi sistem.",
  },
];

const MENU_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  kependudukan: Users,
  persuratan: FileText,
  "data-desa": Map,
  keuangan: Wallet,
  pembangunan: Hammer,
  sosial: HeartPulse,
  umkm: Store,
  aduan: MessageCircle,
  arsip: Archive,
  pengaturan: Settings,
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const current = MENUS.find((m) => m.id === activeMenu)!;

  return (
    <div className={"app-layout" + (sidebarOpen ? "" : " app-layout-full") }>
      <Sidebar
        menus={MENUS}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        onLogout={() => setIsLoggedIn(false)}
        menuIcons={MENU_ICONS}
        className={sidebarOpen ? '' : 'sidebar-hidden'}
      />
      <div className={sidebarOpen ? 'main-area' : 'main-area main-area-full'}>
        <TopHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          userName="Sekretariat Desa Sugihan"
          onLogout={() => setIsLoggedIn(false)}
        />
        <main className="main-content">
          <header className="main-header">
            <h1>{current.label}</h1>
            <p>{current.description}</p>
          </header>

          {/* CONTENT */}
          {activeMenu === "dashboard" && (
            <Card title="Dashboard">
              <p>Ringkasan data desa akan tampil di sini.</p>
            </Card>
          )}

          {activeMenu === "kependudukan" && (
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
        )}

        {activeMenu === "persuratan" && (
          <Card title="Persuratan">
            <p>Daftar layanan surat akan tampil di sini.</p>
          </Card>
        )}

        {activeMenu === "pengaturan" && (
          <Card title="Pengaturan">
            <p>Pengaturan sistem aplikasi.</p>
          </Card>
        )}
        {/* ...existing code... */}
        </main>
      </div>
    </div>
  );
}
