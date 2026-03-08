import React, { useState } from "react";
import { FileText } from "lucide-react";
import { handlePersuratan } from "../../utils/handlePersuratan";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

const SKTMPage = () => {
  const [openPreview, setOpenPreview] = useState(false);

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

          <div className="mt-2 bg-white border border-gray-200 rounded-xl p-8 text-gray-800 text-sm leading-relaxed">
            <div className="text-center text-xs leading-tight mb-2">
              <div className="font-semibold uppercase">Pemerintah Kabupaten Pati</div>
              <div className="font-semibold uppercase">Kecamatan Winong</div>
              <div className="font-bold uppercase text-base mt-1">Desa Sugihan</div>
              <div className="mt-1">Alamat: ............................................................</div>
            </div>
            <div className="border-t border-gray-400 my-3" />

            <div className="text-center mt-3">
              <div className="font-semibold underline text-base">
                SURAT KETERANGAN TIDAK MAMPU
              </div>
              <div className="text-xs mt-1">Nomor: ...... / ...... / ......</div>
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
                    <td>.................................................................</td>
                  </tr>
                  <tr>
                    <td className="align-top">NIK</td>
                    <td className="px-2 align-top">:</td>
                    <td>.................................................................</td>
                  </tr>
                  <tr>
                    <td className="align-top">Tempat/Tgl Lahir</td>
                    <td className="px-2 align-top">:</td>
                    <td>.................................................................</td>
                  </tr>
                  <tr>
                    <td className="align-top">Alamat</td>
                    <td className="px-2 align-top">:</td>
                    <td>
                      RT ...... / RW ......, Desa Sugihan, Kec. Winong, Kab. Pati
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top">Keperluan</td>
                    <td className="px-2 align-top">:</td>
                    <td>.................................................................</td>
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
                <div>Sugihan, ............................ 20..</div>
                <div className="mt-1">Kepala Desa Sugihan</div>
                <div className="mt-10 font-semibold underline">
                  ............................................
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
              onClick={handlePersuratan}
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