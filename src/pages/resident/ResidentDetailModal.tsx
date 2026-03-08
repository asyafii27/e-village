import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { User } from "lucide-react";
import { format } from "date-fns";

interface ResidentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident: any | null;
}

const ResidentDetailModal: React.FC<ResidentDetailModalProps> = ({
  open,
  onOpenChange,
  resident,
}) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  const FILE_BASE_URL = API_BASE_URL.replace(/\/_?api\/?$/, "");

  const photoUrl =
    resident?.formal_foto && typeof resident.formal_foto === "string"
      ? resident.formal_foto.startsWith("http")
        ? resident.formal_foto
        : `${FILE_BASE_URL}/${resident.formal_foto}`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-green-700">
            Detail Data Penduduk
          </DialogTitle>
        </DialogHeader>
        {resident ? (
          <div className="mt-2 flex gap-4">
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Foto penduduk"
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <span className="text-xs text-gray-500">Foto</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-medium text-gray-500">Nama Lengkap</div>
              <div className="text-gray-800">{resident.full_name}</div>

              <div className="font-medium text-gray-500">NIK</div>
              <div className="text-gray-800">{resident.nik}</div>

              <div className="font-medium text-gray-500">Jenis Kelamin</div>
              <div className="text-gray-800">{resident.gender}</div>

              <div className="font-medium text-gray-500">Tempat, Tanggal Lahir</div>
              <div className="text-gray-800">
                {resident.place_of_birth || "-"},{" "}
                {resident.date_of_birth
                  ? format(new Date(resident.date_of_birth), "dd/MM/yyyy")
                  : "-"}
              </div>

              <div className="font-medium text-gray-500">RT/RW</div>
              <div className="text-gray-800">
                {resident.rt}/{resident.rw}
              </div>

              <div className="font-medium text-gray-500">Agama</div>
              <div className="text-gray-800">{resident.religion || "-"}</div>

              <div className="font-medium text-gray-500">Status Perkawinan</div>
              <div className="text-gray-800">{resident.marital_status || "-"}</div>

              <div className="font-medium text-gray-500">Provinsi Lahir</div>
              <div className="text-gray-800">
                {resident.birth_province?.name || "-"}
              </div>

              <div className="font-medium text-gray-500">Kabupaten Lahir</div>
              <div className="text-gray-800">
                {resident.birth_city?.name || "-"}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            Data penduduk tidak tersedia.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResidentDetailModal;
