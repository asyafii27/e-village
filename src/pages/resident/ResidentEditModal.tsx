import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { ToastrError, ToastrSuccess } from "../../components/ui/Toastr";
import Select from "react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { UploadCloud } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

interface ResidentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident: any | null;
  onSuccess?: () => void;
}

const ResidentEditModal: React.FC<ResidentEditModalProps> = ({
  open,
  onOpenChange,
  resident,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const [date, setDate] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState<any[]>([]);
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const token = localStorage.getItem("authToken");

  const formValues = watch();
  const selectedPhoto = formValues.formal_foto?.[0];
  const isFormComplete = Boolean(
    formValues.full_name &&
      formValues.nik &&
      formValues.gender &&
      formValues.religion &&
      formValues.rt !== undefined &&
      formValues.rt !== null &&
      formValues.rt !== "" &&
      formValues.rw !== undefined &&
      formValues.rw !== null &&
      formValues.rw !== "" &&
      formValues.village &&
      formValues.marital_status &&
      formValues.birth_province_code &&
      formValues.birth_city_code &&
      date,
  );

  // Initialize form when resident changes
  useEffect(() => {
    if (!resident) {
      reset();
      setDate(undefined);
      setSelectedProvince(null);
      setSelectedCity(null);
      return;
    }

    reset({
      full_name: resident.full_name || "",
      nik: resident.nik || "",
      gender: resident.gender || "L",
      religion: resident.religion || "Islam",
      rt: resident.rt ?? "",
      rw: resident.rw ?? "",
      village: resident.village || "",
      marital_status: resident.marital_status || "belum_kawin",
      birth_province_code: resident.birth_province_code || "",
      birth_city_code: resident.birth_city_code || "",
    });

    if (resident.date_of_birth) {
      setDate(new Date(resident.date_of_birth));
    } else {
      setDate(undefined);
    }

    if (!resident.birth_province_code) {
      setSelectedProvince(null);
    }

    if (!resident.birth_city_code) {
      setSelectedCity(null);
    }
  }, [resident, reset]);

  // Fetch provinces
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

        if (resident?.birth_province_code) {
          const current = options.find(
            (opt: any) => opt.value === resident.birth_province_code,
          );
          if (current) {
            setSelectedProvince(current);
            setValue("birth_province_code", current.value);
          }
        }
      })
      .catch(() => {
        toast.error(<ToastrError message="Gagal mengambil data provinsi" />, {
          className: "toastify-error",
        });
      })
      .finally(() => setLoadingProvinces(false));
  }, [resident, setValue, token]);

  // Fetch cities when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCityOptions([]);
      setSelectedCity(null);
      setValue("birth_city_code", "");
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

        if (resident?.birth_city_code) {
          const current = options.find(
            (opt: any) => opt.value === resident.birth_city_code,
          );
          if (current) {
            setSelectedCity(current);
            setValue("birth_city_code", current.value);
          }
        }
      })
      .catch(() => {
        toast.error(
          <ToastrError message="Gagal mengambil data kota/kabupaten" />,
          { className: "toastify-error" },
        );
      })
      .finally(() => setLoadingCities(false));
  }, [selectedProvince, resident, setValue, token]);

  const handleEditResident = async (data: any) => {
    if (!resident) return;

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "date_of_birth") {
          return;
        }

        if (key === "formal_foto") {
          const files = data[key];
          if (files && files.length > 0) {
            formData.append("formal_foto", files[0]);
          }
          return;
        }

        formData.append(key, data[key]);
      });

      if (selectedCity?.label) {
        formData.append("place_of_birth", selectedCity.label);
      }

      if (date) {
        formData.append("date_of_birth", date.toISOString().split("T")[0]);
      }

      await axiosInstance.put(`/residents/${resident.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        <ToastrSuccess message="Data berhasil diperbarui" />,
        { className: "toastify-success" },
      );
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const apiError = error?.response?.data;

      let errorMessage = "Gagal memperbarui data";

      if (apiError) {
        if (typeof apiError.message === "string" && apiError.message.trim()) {
          errorMessage = apiError.message;
        } else if (
          apiError.errors &&
          typeof apiError.errors === "object" &&
          Object.keys(apiError.errors).length > 0
        ) {
          const firstKey = Object.keys(apiError.errors)[0];
          const fieldMessage = apiError.errors[firstKey];
          if (typeof fieldMessage === "string" && fieldMessage.trim()) {
            errorMessage = fieldMessage;
          }
        }
      }

      toast.error(<ToastrError message={errorMessage} />, {
        className: "toastify-error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-green-700">
            Edit Data Kependudukan
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <form onSubmit={handleSubmit(handleEditResident)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Provinsi Lahir <span className="text-red-600">*</span>
                </label>
                <Select
                  options={provinceOptions}
                  value={selectedProvince}
                  onChange={(option) => {
                    setSelectedProvince(option);
                    setValue("birth_province_code", option ? option.value : "");
                    setSelectedCity(null);
                    setValue("birth_city_code", "");
                  }}
                  isLoading={loadingProvinces}
                  placeholder="Pilih Provinsi"
                  isClearable
                  classNamePrefix="react-select"
                />
                <input type="hidden" {...register("birth_province_code")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kabupaten Lahir <span className="text-red-600">*</span>
                </label>
                <Select
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(option) => {
                    setSelectedCity(option);
                    setValue("birth_city_code", option ? option.value : "");
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
                <input type="hidden" {...register("birth_city_code")} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Lengkap <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("full_name")}
                  type="text"
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
                        setDate(d || undefined);
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
                  className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  RW <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("rw", { valueAsNumber: true })}
                  type="number"
                  className="border border-gray-300 focus:border-green-500 focus:border-2 focus:ring-2 focus:ring-green-500/50 focus:outline-none rounded px-4 py-1 w-full"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Desa <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("village")}
                  type="text"
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
                  <option value="belum_kawin">Belum Kawin</option>
                  <option value="kawin">Kawin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Foto (opsional)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-md px-4 py-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                  <input
                    {...register("formal_foto")}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="text-green-600 mb-2" size={24} />
                  <p className="text-sm font-medium text-gray-700">
                    Tarik & letakkan foto di sini
                  </p>
                  <p className="text-xs text-gray-500">
                    atau klik untuk memilih file baru
                  </p>
                  {selectedPhoto && (
                    <p className="mt-2 text-xs text-gray-600 truncate w-full">
                      File terpilih: {selectedPhoto.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-gray-300 text-black px-4 py-1 rounded mr-2 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting || !isFormComplete}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size={16} />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResidentEditModal;
