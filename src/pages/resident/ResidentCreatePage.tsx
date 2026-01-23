import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";

interface ResidentCreatePageProps {
  onSuccess?: () => void;
}

const ResidentCreatePage: React.FC<ResidentCreatePageProps> = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const [date, setDate] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);

  const handleAddResident = async (data: any) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "date_of_birth") {
          formData.append(key, data[key]);
        }
      });
      // Tambahkan date_of_birth dari state date
      if (date) {
        formData.append("date_of_birth", date.toISOString().split("T")[0]);
      }
      await axiosInstance.post("/residents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Data berhasil ditambahkan");
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Gagal menambahkan data");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Tambah Data Kependudukan</h1>
      <p className="text-sm text-red-600 mb-4">* wajib diisi</p>
      <form onSubmit={handleSubmit(handleAddResident)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nama Lengkap <span className="text-red-600">*</span></label>
            <input
              {...register("full_name")}
              type="text"
              placeholder="Contoh: Budi Santoso"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">NIK <span className="text-red-600">*</span></label>
            <input
              {...register("nik")}
              type="text"
              placeholder="Contoh: 3374xxxxxxxxxxxx"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Jenis Kelamin <span className="text-red-600">*</span></label>
            <select {...register("gender")} className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full" required>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Agama <span className="text-red-600">*</span></label>
            <input
              {...register("religion")}
              type="text"
              placeholder="Contoh: Islam"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tempat Lahir <span className="text-red-600">*</span></label>
            <input
              {...register("place_of_birth")}
              type="text"
              placeholder="Contoh: Pati"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tanggal Lahir <span className="text-red-600">*</span></label>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <input
                  type="text"
                  readOnly
                  value={date ? format(date, "dd/MM/yyyy") : ""}
                  onClick={() => setOpenDate(true)}
                  placeholder="Pilih tanggal lahir"
                  className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full cursor-pointer bg-white"
                  required
                />
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto bg-white">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setOpenDate(false); }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium">RT <span className="text-red-600">*</span></label>
            <input
              {...register("rt")}
              type="text"
              placeholder="Contoh: 01"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">RW <span className="text-red-600">*</span></label>
            <input
              {...register("rw")}
              type="text"
              placeholder="Contoh: 02"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Desa <span className="text-red-600">*</span></label>
            <input
              {...register("village")}
              type="text"
              placeholder="Contoh: Sugihan"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status Perkawinan <span className="text-red-600">*</span></label>
            <input
              {...register("marital_status")}
              type="text"
              placeholder="Contoh: Belum Kawin"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Foto <span className="text-red-600">*</span></label>
            <input
              {...register("formal_foto")}
              type="file"
              className="border border-green-500 focus:border-green-700 focus:border-2 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-1 w-full"
              accept="image/*"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="reset"
            onClick={() => reset()}
            className="bg-gray-300 text-black px-4 py-1 rounded mr-2 hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResidentCreatePage;