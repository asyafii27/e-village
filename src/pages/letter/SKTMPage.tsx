import React, { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import Select from "react-select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import axiosInstance from "../../utils/axiosInstance";
import { useDebounce } from "use-debounce";

const SKTMPage = () => {
  const [openPreview, setOpenPreview] = useState(false);
  const letterRef = useRef<HTMLDivElement | null>(null);

  // Field yang bisa langsung diedit di dalam template
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [tempatTglLahir, setTempatTglLahir] = useState("");
  const [alamat, setAlamat] = useState("RT .. / RW .., Desa Sugihan, Kec. Winong, Kab. Pati");
  const [keperluan, setKeperluan] = useState("");
  const [nomorSurat, setNomorSurat] = useState("...... / ...... / ......");
  const [tanggalSurat, setTanggalSurat] = useState("............................ 20..");
  const [namaKepalaDesa, setNamaKepalaDesa] = useState("............................................");

   // Pencarian dan pilihan penduduk untuk mengisi otomatis
  const [searchName, setSearchName] = useState("");
  const [debouncedSearchName] = useDebounce(searchName, 500);
  const [residentOptions, setResidentOptions] = useState<any[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [residentError, setResidentError] = useState<string | null>(null);
  const [selectedResident, setSelectedResident] = useState<any | null>(null);

  useEffect(() => {
    if (!openPreview) return;

    const fetchResidents = async () => {
      setLoadingResidents(true);
      setResidentError(null);
      try {
        const res = await axiosInstance.get("/residents", {
          params: {
            page: 1,
            page_size: 10,
            // dukung kedua kemungkinan parameter pencarian
            global_search: debouncedSearchName || undefined,
            name: debouncedSearchName || undefined,
          },
        });
        setResidentOptions(res.data?.data || []);
      } catch (error) {
        console.error("Gagal mengambil data penduduk untuk SKTM", error);
        setResidentError("Gagal mengambil data penduduk");
      } finally {
        setLoadingResidents(false);
      }
    };

    fetchResidents();
  }, [openPreview, debouncedSearchName]);

  const handleSelectResident = (residentId: string) => {
    const resident = residentOptions.find((r: any) => String(r.id) === residentId);
    if (!resident) return;

    setSelectedResident(resident);
    setNama(resident.full_name || "");
    setNik(resident.nik || "");

    const tempat = resident.place_of_birth || "";
    const tgl = resident.date_of_birth
      ? new Date(resident.date_of_birth).toLocaleDateString("id-ID")
      : "";
    setTempatTglLahir(
      tempat && tgl ? `${tempat}, ${tgl}` : tempat || tgl || "",
    );

    if (resident.rt || resident.rw) {
      setAlamat(
        `RT ${resident.rt || ".."} / RW ${resident.rw || ".."}, Desa Sugihan, Kec. Winong, Kab. Pati`,
      );
    }
  };

  const handleDownloadPdf = async () => {
    if (!letterRef.current) return;

    const element = letterRef.current;
    try {
      const canvas = await html2canvas(element, {
        scale: 3, // resolusi lebih tinggi supaya teks lebih jelas
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;

      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      const fileName = `SKTM-${nama || "penduduk"}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Gagal membuat PDF SKTM di frontend", error);
      alert("Gagal membuat PDF di sisi frontend.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-700">Layanan Persuratan Desa</h1>
        <p className="text-gray-600">Pilih jenis surat yang ingin Anda buat.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* SKTM */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-lg bg-green-100 text-green-700">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Surat Keterangan Tidak Mampu (SKTM)
                </h2>
                <p className="text-sm text-gray-500">
                  Digunakan untuk keperluan bantuan pendidikan, kesehatan, dan administrasi lainnya.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setOpenPreview(true)}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Lihat Template SKTM
            </button>
          </div>
        </div>

        {/* Izin tidak masuk kerja */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-lg bg-green-100 text-green-700">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Surat Izin Tidak Masuk Kerja
                </h2>
                <p className="text-sm text-gray-500">
                  Surat keterangan resmi dari desa untuk keperluan izin tidak masuk kerja.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-white border border-green-600 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Buat Surat Izin
            </button>
          </div>
        </div>

        {/* Pengantar pembuatan KTP */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-lg bg-green-100 text-green-700">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Surat Pengantar Pembuatan KTP
                </h2>
                <p className="text-sm text-gray-500">
                  Surat pengantar resmi dari desa untuk proses pembuatan KTP baru.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-white border border-green-600 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Buat Surat Pengantar
            </button>
          </div>
        </div>
      </div>

      {/* Preview Template SKTM */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-green-700">
              Preview Surat Keterangan Tidak Mampu (SKTM)
            </DialogTitle>
          </DialogHeader>

          {/* Form pilih penduduk untuk autofill */}
          <div className="mt-2 mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
            <div className="font-semibold text-gray-700 mb-2">
              Pilih Penduduk
            </div>
            <Select
              classNamePrefix="sktm-resident-select"
              placeholder="Cari nama atau NIK penduduk..."
              isClearable
              isLoading={loadingResidents}
              options={residentOptions.map((r: any) => ({
                value: String(r.id),
                label: `${r.full_name} - ${r.nik}`,
              }))}
              value={
                selectedResident
                  ? {
                      value: String(selectedResident.id),
                      label: `${selectedResident.full_name} - ${selectedResident.nik}`,
                    }
                  : null
              }
              onChange={(option: any) => {
                if (!option) {
                  setSelectedResident(null);
                  return;
                }
                handleSelectResident(option.value as string);
              }}
              onInputChange={(input, meta) => {
                if (meta.action === "input-change") {
                  setSearchName(input);
                }
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 32,
                  fontSize: 12,
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: 12,
                  zIndex: 9999,
                }),
              }}
            />
            {loadingResidents && (
              <p className="mt-1 text-[11px] text-gray-500">
                Memuat data penduduk...
              </p>
            )}
            {residentError && (
              <p className="mt-1 text-[11px] text-red-500">{residentError}</p>
            )}
          </div>

          <div
            ref={letterRef}
            className="mt-2 bg-white border border-gray-200 rounded-xl p-8 text-gray-800 text-sm leading-relaxed"
          >
            <div className="text-center text-xs leading-tight mb-2">
              <div className="font-semibold uppercase">Pemerintah Kabupaten Pati</div>
              <div className="font-semibold uppercase">Kecamatan Winong</div>
              <div className="font-bold uppercase text-base mt-1">Desa Sugihan</div>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span>Alamat:</span>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="border-b border-dotted border-gray-400 bg-transparent text-[10px] px-1 focus:outline-none focus:border-gray-600 w-64 text-center"
                />
              </div>
            </div>
            <div className="border-t border-gray-400 my-3" />

            <div className="text-center mt-3">
              <div className="font-semibold underline text-base">
                SURAT KETERANGAN TIDAK MAMPU
              </div>
              <div className="text-xs mt-1 flex items-center justify-center gap-1">
                <span>Nomor:</span>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  className="border-b border-dotted border-gray-400 bg-transparent text-[10px] px-1 focus:outline-none focus:border-gray-600 w-40 text-center"
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p>
                Yang bertanda tangan di bawah ini Kepala Desa Sugihan, Kecamatan Winong,
                Kabupaten Pati, dengan ini menerangkan bahwa:
              </p>

              <table className="mt-2 text-sm">
                <tbody>
                  <tr>
                    <td className="align-top w-32">Nama</td>
                    <td className="px-2 align-top">:</td>
                    <td>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="border-b border-dotted border-gray-400 bg-transparent w-full text-sm px-1 focus:outline-none focus:border-gray-600"
                        placeholder="Isikan nama lengkap"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top">NIK</td>
                    <td className="px-2 align-top">:</td>
                    <td>
                      <input
                        type="text"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        className="border-b border-dotted border-gray-400 bg-transparent w-full text-sm px-1 focus:outline-none focus:border-gray-600"
                        placeholder="Isikan NIK"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top">Tempat/Tgl Lahir</td>
                    <td className="px-2 align-top">:</td>
                    <td>
                      <input
                        type="text"
                        value={tempatTglLahir}
                        onChange={(e) => setTempatTglLahir(e.target.value)}
                        className="border-b border-dotted border-gray-400 bg-transparent w-full text-sm px-1 focus:outline-none focus:border-gray-600"
                        placeholder="Contoh: Pati, 01 Januari 2000"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top">Alamat</td>
                    <td className="px-2 align-top">:</td>
                    <td>
                      <input
                        type="text"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        className="border-b border-dotted border-gray-400 bg-transparent w-full text-sm px-1 focus:outline-none focus:border-gray-600"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top">Keperluan</td>
                    <td className="px-2 align-top">:</td>
                    <td>
                      <input
                        type="text"
                        value={keperluan}
                        onChange={(e) => setKeperluan(e.target.value)}
                        className="border-b border-dotted border-gray-400 bg-transparent w-full text-sm px-1 focus:outline-none focus:border-gray-600"
                        placeholder="Contoh: Pengajuan bantuan pendidikan"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-4">
                Berdasarkan data dan keterangan yang ada, benar bahwa yang bersangkutan
                termasuk keluarga yang kondisi ekonominya kurang mampu.
              </p>

              <p>
                Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat
                dipergunakan sebagaimana mestinya.
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="text-xs text-right">
                <div>
                  Sugihan,
                  <input
                    type="text"
                    value={tanggalSurat}
                    onChange={(e) => setTanggalSurat(e.target.value)}
                    className="ml-1 border-b border-dotted border-gray-400 bg-transparent text-[10px] px-1 focus:outline-none focus:border-gray-600 w-40"
                  />
                </div>
                <div className="mt-1">Kepala Desa Sugihan</div>
                <div className="mt-10 font-semibold underline">
                  <input
                    type="text"
                    value={namaKepalaDesa}
                    onChange={(e) => setNamaKepalaDesa(e.target.value)}
                    className="border-b border-dotted border-gray-400 bg-transparent text-[10px] px-1 focus:outline-none focus:border-gray-600 w-48 text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <button
              type="button"
              onClick={() => setOpenPreview(false)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              Download PDF SKTM
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SKTMPage;