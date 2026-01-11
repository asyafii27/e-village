import { useState } from "react";
import "./style.css";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

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

const MENU_ICONS: Record<string, string> = {
  dashboard: "📊",
  kependudukan: "👥",
  persuratan: "📄",
  "data-desa": "🗺️",
  keuangan: "💰",
  pembangunan: "🏗️",
  sosial: "🏥",
  umkm: "🏪",
  aduan: "📢",
  arsip: "📚",
  pengaturan: "⚙️",
};

const PERSURATAN_TYPES: { id: string; name: string; description: string }[] = [
  {
    id: "ktp-kk",
    name: "Surat Pengantar KTP/KK",
    description: "Pengantar untuk pembuatan atau perubahan KTP dan Kartu Keluarga.",
  },
  {
    id: "domisili",
    name: "Surat Keterangan Domisili",
    description: "Keterangan tempat tinggal resmi warga Desa Sugihan.",
  },
  {
    id: "sku",
    name: "Surat Keterangan Usaha (SKU)",
    description: "Keterangan legalitas usaha mikro/kecil yang dimiliki warga.",
  },
  {
    id: "sktm",
    name: "Surat Keterangan Tidak Mampu (SKTM)",
    description: "Keterangan untuk keperluan bantuan pendidikan atau sosial.",
  },
  {
    id: "nikah",
    name: "Surat Pengantar Nikah",
    description: "Pengantar administrasi pernikahan ke KUA atau instansi terkait.",
  },
  {
    id: "kelahiran-kematian",
    name: "Surat Keterangan Kelahiran / Kematian",
    description: "Dasar pengurusan akta kelahiran atau akta kematian.",
  },
  {
    id: "pindah",
    name: "Surat Pengantar Pindah Datang / Pindah Keluar",
    description: "Pengantar perpindahan penduduk antar wilayah.",
  },
];

function App() {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedLetterType, setSelectedLetterType] = useState<string | null>(
    null
  );
  const [showResidentModal, setShowResidentModal] = useState<boolean>(false);

  const current = MENUS.find((m) => m.id === activeMenu) ?? MENUS[0];

  const handleSelectMenu = (id: string) => {
    setActiveMenu(id);
    if (id !== "persuratan") {
      setSelectedLetterType(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <Card className="login-card">
          <div className="login-hero">
            <div className="login-hero-icon">🏡</div>
            <div className="login-hero-text">
              <h1 className="login-hero-title">Sistem Manajemen Desa Sugihan</h1>
              <p className="login-hero-subtitle">Kec. Winong, Kab. Pati, Jawa Tengah</p>
            </div>
          </div>
          <p className="login-subtitle">
            Silakan masuk menggunakan NIK dan kata sandi untuk mengelola layanan dan data Desa Sugihan.
          </p>
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              setIsLoggedIn(true);
            }}
          >
            <label className="login-field">
              <span>NIK</span>
              <input type="text" placeholder="Masukkan NIK" required />
            </label>
            <label className="login-field">
              <span>Kata sandi</span>
              <input type="password" placeholder="Masukkan kata sandi" required />
            </label>
            <Button type="submit" variant="primary" className="login-submit">
              Masuk ke Sistem
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className={"app-root" + (sidebarOpen ? "" : " app-root-no-sidebar")}>
      <header className="top-header">
        <div className="top-header-left">
          <button
            className="top-header-toggle"
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            title={sidebarOpen ? "Sembunyikan menu" : "Tampilkan menu"}
          >
            <span className="toggle-icon">{sidebarOpen ? "⮜" : "⮞"}</span>
          </button>
          <div className="top-header-title">
            <div className="top-village-name">Sistem Manajemen Desa Sugihan</div>
            <div className="top-village-meta">Kec. Winong, Kab. Pati, Jawa Tengah</div>
          </div>
        </div>
        <div className="top-header-right">
          <div className="profile-wrapper">
            <button
              type="button"
              className="profile-trigger"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="profile-avatar">DS</span>
            </button>
            {profileOpen && (
              <div className="profile-menu">
                <div className="profile-info">
                  <div className="profile-name">Sekretariat Desa Sugihan</div>
                  <div className="profile-role">Operator Sistem</div>
                </div>
                <button type="button" className="profile-menu-item">
                  Profil
                </button>
                <button
                  type="button"
                  className="profile-menu-item profile-menu-logout"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setProfileOpen(false);
                  }}
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="app-layout">
        <aside
          className={
            "sidebar" + (sidebarOpen ? "" : " sidebar-hidden")
          }
        >
            <div className="sidebar-header">
              <div className="village-name">Desa Sugihan</div>
              <div className="village-meta">Kec. Winong, Kab. Pati, Jawa Tengah</div>
            </div>
            <nav className="sidebar-menu">
              {MENUS.map((menu) => (
                <button
                  key={menu.id}
                  className={
                    "sidebar-item" +
                    (menu.id === activeMenu ? " sidebar-item-active" : "")
                  }
                  onClick={() => handleSelectMenu(menu.id)}
                >
                  <span className="menu-icon">
                    {MENU_ICONS[menu.id] ?? "•"}
                  </span>
                  <span className="menu-label">{menu.label}</span>
                </button>
              ))}
            </nav>
            <div className="sidebar-footer">
              <button
                type="button"
                className="sidebar-logout"
                onClick={() => setIsLoggedIn(false)}
              >
                <span className="menu-icon">⏻</span>
                <span className="menu-label">Keluar</span>
              </button>
            </div>
          </aside>

        <main className="main-content">
          <header className="main-header">
            <div>
              <h1 className="page-title">{current.label}</h1>
              <p className="page-subtitle">{current.description}</p>
            </div>
            <div className="main-actions">
              {activeMenu === "aduan" && (
                <Button variant="outline">Tambah Aduan Warga</Button>
              )}
            </div>
          </header>

          <section className="content-grid">
          {activeMenu === "dashboard" && (
            <>
              <Card title="Ringkasan Penduduk">
                <p>Total penduduk, jumlah KK, dan komposisi demografi Desa Sugihan akan ditampilkan di sini.</p>
              </Card>
              <Card title="Status Layanan Surat">
                <p>Grafik dan daftar singkat permohonan surat terbaru.</p>
              </Card>
              <Card title="Kegiatan Hari Ini">
                <p>Agenda pelayanan, musyawarah, atau kegiatan desa lainnya.</p>
              </Card>
            </>
          )}

          {activeMenu === "persuratan" && selectedLetterType === null && (
            <>
              {PERSURATAN_TYPES.map((type) => (
                <Card
                  key={type.id}
                  title={type.name}
                  className="surat-card"
                  onClick={() => setSelectedLetterType(type.id)}
                >
                  <p>{type.description}</p>
                </Card>
              ))}
            </>
          )}

          {activeMenu === "persuratan" && selectedLetterType !== null && (
            <>
              <Card className="surat-header-card">
                <button
                  type="button"
                  className="btn-base btn-ghost surat-back"
                  onClick={() => setSelectedLetterType(null)}
                >
                  ← Kembali ke daftar layanan
                </button>
                <h2 className="surat-title">
                  {
                    PERSURATAN_TYPES.find((t) => t.id === selectedLetterType)
                      ?.name
                  }
                </h2>
                <p className="surat-help">
                  Silakan lengkapi data pemohon untuk membuat surat, dan lihat riwayat
                  permohonan di sebelah kanan.
                </p>
              </Card>
              <Card title="Form Permohonan" className="surat-form-card">
                <p>
                  Di sini nanti akan berisi form lengkap untuk jenis surat ini
                  (data pemohon, keperluan, dan informasi lainnya).
                </p>
              </Card>
              <Card className="surat-list-card">
                <div className="surat-list-header">
                  <h2 className="card-title">Daftar Permohonan</h2>
                  <Button variant="primary">Buat Surat Baru</Button>
                </div>
                <p>
                  Tabel/list permohonan untuk jenis surat ini akan tampil di sini
                  (status, tanggal, dan pemohon).
                </p>
              </Card>
            </>
          )}

          {activeMenu === "kependudukan" && (
            <>
              <Card title="Data Warga Desa Sugihan" className="dashboard-warga-card">
                <div className="kependudukan-header">
                  <p className="kependudukan-summary">
                    Berikut adalah daftar ringkas warga Desa Sugihan. Gunakan tombol di bawah ini untuk menambahkan data penduduk baru.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowResidentModal(true)}
                  >
                    Tambah Data Warga
                  </Button>
                </div>
                <div className="table-wrapper">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>NIK</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Agama</TableHead>
                        <TableHead>Tempat, Tanggal Lahir</TableHead>
                        <TableHead>RT</TableHead>
                        <TableHead>RW</TableHead>
                        <TableHead>Desa</TableHead>
                        <TableHead>Status Perkawinan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Contoh Warga 1</TableCell>
                        <TableCell>3378xxxxxxxxxxxx</TableCell>
                        <TableCell>L</TableCell>
                        <TableCell>Islam</TableCell>
                        <TableCell>Pati, 01-01-1990</TableCell>
                        <TableCell>01</TableCell>
                        <TableCell>01</TableCell>
                        <TableCell>Sugihan</TableCell>
                        <TableCell>Kawin</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Contoh Warga 2</TableCell>
                        <TableCell>3378xxxxxxxxxxxx</TableCell>
                        <TableCell>P</TableCell>
                        <TableCell>Islam</TableCell>
                        <TableCell>Pati, 12-05-1995</TableCell>
                        <TableCell>02</TableCell>
                        <TableCell>03</TableCell>
                        <TableCell>Sugihan</TableCell>
                        <TableCell>Belum Kawin</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {showResidentModal && (
                <div className="modal-backdrop" role="dialog" aria-modal="true">
                  <div className="modal-card">
                    <div className="modal-header">
                      <h2 className="modal-title">Tambah Data Warga</h2>
                      <button
                        type="button"
                        className="btn-base btn-ghost modal-close"
                        onClick={() => setShowResidentModal(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <form
                      className="modal-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        setShowResidentModal(false);
                      }}
                    >
                      <div className="modal-grid">
                        <label className="login-field">
                          <span>Nama Lengkap</span>
                          <input type="text" placeholder="Masukkan nama warga" required />
                        </label>
                        <label className="login-field">
                          <span>NIK</span>
                          <input type="text" placeholder="Masukkan NIK" required />
                        </label>
                        <label className="login-field">
                          <span>Jenis Kelamin</span>
                          <select defaultValue="" required>
                            <option value="" disabled>
                              Pilih jenis kelamin
                            </option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                        </label>
                        <label className="login-field">
                          <span>Agama</span>
                          <select defaultValue="" required>
                            <option value="" disabled>
                              Pilih agama
                            </option>
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Buddha">Buddha</option>
                            <option value="Konghucu">Konghucu</option>
                          </select>
                        </label>
                        <label className="login-field">
                          <span>Tempat Lahir</span>
                          <input type="text" placeholder="Masukkan tempat lahir" required />
                        </label>
                        <label className="login-field">
                          <span>Tanggal Lahir</span>
                          <input type="date" required />
                        </label>
                        <label className="login-field">
                          <span>RT</span>
                          <input type="text" placeholder="RT" required />
                        </label>
                        <label className="login-field">
                          <span>RW</span>
                          <input type="text" placeholder="RW" required />
                        </label>
                        <label className="login-field">
                          <span>Desa</span>
                          <input type="text" defaultValue="Sugihan" required />
                        </label>
                        <label className="login-field">
                          <span>Status Perkawinan</span>
                          <select defaultValue="" required>
                            <option value="" disabled>
                              Pilih status
                            </option>
                            <option value="Belum Kawin">Belum Kawin</option>
                            <option value="Kawin">Kawin</option>
                            <option value="Cerai Hidup">Cerai Hidup</option>
                            <option value="Cerai Mati">Cerai Mati</option>
                          </select>
                        </label>
                      </div>
                      <div className="modal-actions">
                        <Button type="button" variant="ghost" onClick={() => setShowResidentModal(false)}>
                          Batal
                        </Button>
                        <Button type="submit" variant="primary">
                          Simpan Data
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {activeMenu !== "dashboard" &&
            activeMenu !== "persuratan" &&
            activeMenu !== "kependudukan" && (
            <Card title={current.label}>
              <p>
                Konten detail untuk menu <strong>{current.label}</strong> akan dikembangkan di sini
                (tabel data, grafik, dan form sesuai kebutuhan Desa Sugihan).
              </p>
            </Card>
          )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
