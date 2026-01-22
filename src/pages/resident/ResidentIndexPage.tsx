import React, {useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";
import {toast} from "react-toastify";
import { ToastrError } from "../../components/ui/Toastr";
import {Breadcrumb} from "../../components/ui/Breadcrumb"
import { useDebounce } from "use-debounce";
import { Eraser, Store } from "lucide-react";

const ResidentIndexPage: React.FC = () => {
    const [residents, setResidentUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalResidents, setTotalResidents] = useState(10)
    const [searchQuery, setSearchQuery] = useState(10)
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

    useEffect(() => {
        const fetchResidents = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await axiosInstance.get("/residents", {
                    params: {
                        page: currentPage,
                        page_size: rowsPerPage,
                        sort_by: "id",
                        sort_order: "desc",
                        global_search: debouncedSearchQuery
                    },
                });

                setResidentUsers(response.data.data || []);
                setTotalResidents(response.data.meta.total || 0);
            } catch (err: any) {
                const message = err?.response?.data?.message || err?.response?.data.error || "Gagal mengambil data kependudukan"
                setError(message)
                toast.error(<ToastrError message={message} />, {
                    className : "toastify-error"
                });
            } finally {
                setLoading(false)
            }
        }
    })
}

export default ResidentIndexPage

