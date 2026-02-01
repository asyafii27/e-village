import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ResidentCreatePageProps {
  onSuccess?: () => void;
}

const ResidentCreatePage: React.FC<ResidentCreatePageProps> = ({
  onSuccess,
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [date, setDate] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState<any[]>([]);
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  // Ambil token dari localStorage
  const token = localStorage.getItem("authToken");

  // Fetch provinces saat mount
  useEffect(() => {
    setLoadingProvinces(true);
    axiosInstance
      .get("/region/provinces", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const options = (res.data || []).map((prov: any) => ({
          value: prov.code,
          label: prov.name,
        }));
        setProvinceOptions(options);
        console.log("provinceOptions", options);
      })
      .catch(() => {
        toast.error("Gagal mengambil data provinsi");
      })
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Fetch cities saat province dipilih
  useEffect(() => {
    if (!selectedProvince) {
      setCityOptions([]);
      setSelectedCity(null);
      setValue("city_code", "");
      return;
    }
    setLoadingCities(true);
    axiosInstance
      .get(`/region/cities?province_code=${selectedProvince.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const options = (res.data || []).map((city: any) => ({
          value: city.code,
          label: city.name,
        }));
        setCityOptions(options);
      })
      .catch(() => {
        toast.error("Gagal mengambil data kota/kabupaten");
      })
      .finally(() => setLoadingCities(false));
  }, [selectedProvince, setValue, token]);

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
          {/* Provinsi */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Provinsi <span className="text-red-600">*</span>
            </label>
            <Select
              options={provinceOptions}
              value={selectedProvince}
              onChange={(option) => {
                setSelectedProvince(option);
                setValue("province_code", option ? option.value : "");
                setSelectedCity(null);
                setValue("city_code", "");
              }}
              isLoading={loadingProvinces}
              placeholder="Pilih Provinsi"
              isClearable
              classNamePrefix="react-select"
            />
          </div>
          {/* Kota/Kabupaten */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Kabupaten/Kota <span className="text-red-600">*</span>
            </label>
            <Select
              options={cityOptions}
              value={selectedCity}
              onChange={(option) => {
                setSelectedCity(option);
                setValue("city_code", option ? option.value : "");
              }}
              isLoading={loadingCities}
              placeholder={
                selectedProvince
                  ? "Pilih Kota/Kabupaten"
                  : "Pilih Provinsi dulu"
              }
              isDisabled={!selectedProvince}
              isClearable
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap <span className="text-red-600">*</span>
            </label>
            <input
              {...register("full_name")}
              type="text"
              placeholder="Contoh: Budi Santoso"
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              NIK <span className="text-red-600">*</span>
            </label>
            <input
              {...register("nik")}
              type="text"
              placeholder="Contoh: 3374xxxxxxxxxxxx"
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Jenis Kelamin <span className="text-red-600">*</span>
            </label>
            <select
              {...register("gender")}
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Agama <span className="text-red-600">*</span>
            </label>
            <select
              {...register("religion")}
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
            >
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tempat Lahir <span className="text-red-600">*</span>
            </label>
            <input
              {...register("place_of_birth")}
              type="text"
              placeholder="Contoh: Pati"
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Lahir <span className="text-red-600">*</span>
            </label>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <input
                  type="text"
                  readOnly
                  value={date ? format(date, "dd/MM/yyyy") : ""}
                  onClick={() => setOpenDate(true)}
                  placeholder="Pilih tanggal lahir"
                  className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
                  required
                />
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto bg-white">
                <VisuallyHidden>
                  <span>Dialog Pilih Tanggal Lahir</span>
                </VisuallyHidden>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setOpenDate(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              RT <span className="text-red-600">*</span>
            </label>
            <input
              {...register("rt", { valueAsNumber: true })}
              type="number"
              placeholder="Contoh: 1"
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              RW <span className="text-red-600">*</span>
            </label>
            <input
              {...register("rw", { valueAsNumber: true })}
              type="number"
              placeholder="Contoh: 2"
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Desa <span className="text-red-600">*</span>
            </label>
            <input
              {...register("village")}
              type="text"
              placeholder="Contoh: Sugihan"
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Status Perkawinan <span className="text-red-600">*</span>
            </label>
            <select
              {...register("marital_status")}
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
              required
            >
              <option value="Belum Kawin">Belum Kawin</option>
              <option value="Kawin">Kawin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Foto <span className="text-red-600">*</span>
            </label>
            <input
              {...register("formal_foto")}
              type="file"
              className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
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
