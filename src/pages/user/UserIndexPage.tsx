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
import { ToastrError, ToastrSuccess } from "../../components/ui/Toastr";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const UserIndexPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

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
  }, [currentPage, rowsPerPage]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>
      {loading ? (
        <p>Memuat data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table className="border border-black">
          <TableHeader className="bg-yellow-300 border border-black">
            <TableRow className="border border-black">
              <TableHead className="font-normal border border-black px-4 py-2">
                ID
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
                  {user.id}
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
  );
};

export default UserIndexPage;
