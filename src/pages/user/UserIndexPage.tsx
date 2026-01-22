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
import { Eraser } from "lucide-react";
import { Store } from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const UserIndexPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/users", {
          params: {
            page: currentPage,
            page_size: rowsPerPage,
            sort_by: "id",
            sort_order: "desc",
            global_search: debouncedSearchQuery, // Send search query as global_search parameter
          },
        });

        setUsers(response.data.data || []);
        setTotalUsers(response.data.meta.total || 0); // Update total users from meta
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Login gagal. Periksa kembali email dan kata sandi Anda.";
        setError(message);
        toast.error(<ToastrError message={message} />, {
          className: "toastify-error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, rowsPerPage, debouncedSearchQuery]);

  const totalPages = Math.ceil(totalUsers / rowsPerPage); // Calculate total pages from meta

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when a new search query is entered
  };

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Pengguna", href: "/users" },
        ]}
      />

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>

        <div className="flex items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange} // Updated to use the new handler
            placeholder="Cari nama atau email..."
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
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Store className="text-gray-400 text-6xl" />
            <p className="mt-4 text-gray-600">Tidak ada data</p>
          </div>
        ) : (
          <Table className="border border-black">
            <TableHeader className="bg-yellow-300 border border-black">
              <TableRow className="border border-black">
                <TableHead className="font-normal border border-black px-4 py-2">
                  No
                </TableHead>
                <TableHead className="font-normal border border-black px-4 py-2">
                  Nama
                </TableHead>
                <TableHead className="font-normal border border-black px-4 py-2">
                  Email
                </TableHead>
                <TableHead className="font-normal border border-black px-4 py-2">
                  Dibuat Pada
                </TableHead>
                <TableHead className="font-normal border border-black px-4 py-2">
                  Diperbarui Pada
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any, index: number) => (
                <TableRow
                  key={user.id}
                  className={`border border-black ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-green-100`}
                >
                  <TableCell className="border border-black px-4 py-2">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="border border-black px-4 py-2">
                    {user.name}
                  </TableCell>
                  <TableCell className="border border-black px-4 py-2">
                    {user.email}
                  </TableCell>
                  <TableCell className="border border-black px-4 py-2">
                    {new Date(user.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="border border-black px-4 py-2">
                    {new Date(user.updated_at).toLocaleString()}
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
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, totalUsers)} to {Math.min(currentPage * rowsPerPage, totalUsers)} of {totalUsers} entries
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

export default UserIndexPage;
