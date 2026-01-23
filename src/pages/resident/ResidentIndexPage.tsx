import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { toast } from "react-toastify";
import { ToastrError } from "../../components/ui/Toastr";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { useDebounce } from "use-debounce";
import { Eraser, Store, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import ResidentCreatePage from "./ResidentCreatePage";

const ResidentIndexPage: React.FC = () => {
  const [residents, setResidentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResidents, setTotalResidents] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchResidents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/residents", {
          params: {
            page: currentPage,
            page_size: rowsPerPage,
            sort_by: "id",
            sort_order: "desc",
            global_search: debouncedSearchQuery,
          },
        });

        setResidentUsers(response.data.data || []);
        setTotalResidents(response.data.meta.total || 0);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data.error ||
          "Gagal mengambil data kependudukan";
        setError(message);
        toast.error(<ToastrError message={message} />, {
          className: "toastify-error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, [currentPage, rowsPerPage, debouncedSearchQuery]);

  const totalPages = Math.ceil(totalResidents / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddResident = () => {
    setOpenCreateModal(true);
  };

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Kependudukan", href: "/residents" },
        ]}
      />
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Data Kependudukan</h1>
          <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
            <DialogTrigger asChild>
              <button
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <Plus className="mr-2" /> Tambah Data
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <ResidentCreatePage onSuccess={() => { setOpenCreateModal(false); setCurrentPage(1); }} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Nama atau NIK"
            className="border border-green-500 focus:border-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-4 py-2 w-1/3"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <Eraser />
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : residents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Store className="text-gray-400 text-6xl" />
            <p className="mt-4 text-gray-600">Tidak ada data</p>
          </div>
        ) : (
          <Table className="border border-black">
            <TableHeader className="bg-yellow-300 border order-black">
              <TableRow className="border border-black">
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  No
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  Nama
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  NIK
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  Gender
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  Tempat
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  Tanggal Lahir
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  RT/RW
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  Agama
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  Status Perkawinan
                </TableHead>
                <TableHead className="fpnt-nornal border border-black px-4 py-2">
                  Foto
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents.map((resident: any, index: number) => (
                <TableRow
                  key={resident.id}
                  className={`border border-black ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-green-100`}
                >
                  <TableCell className="border border-black px-4">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.full_name}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.nik}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.gender}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.place_of_birth}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {new Date(resident.date_of_birth).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.rt}/
                    {resident.rw}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.religion || "-"}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.marital_status || "-"}
                  </TableCell>
                  <TableCell className="border border-black px-4">
                    {resident.formal_foto ? (
                      <img
                        src={`${API_BASE_URL}/${resident.formal_foto}`}
                        alt="Foto"
                        className="w-12 h-12 object-cover rounded-full mx-auto cursor-pointer"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-12 h-12 bg-gray-200 rounded-full">
                        <User className="text-gray-400 w-6 h-6" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex justify-between items-center mt-4">
          <div>
            <label htmlFor="rowsPerPage" className="mr-2">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border rounded px-2 py-1"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing{" "}
            {Math.min((currentPage - 1) * rowsPerPage + 1, totalResidents)} to{" "}
            {Math.min(currentPage * rowsPerPage, totalResidents)} of{" "}
            {totalResidents} entries
          </div>

          <div className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentIndexPage;
