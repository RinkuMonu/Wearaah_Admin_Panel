import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
    Eye,
    Search,
    Filter,
    X,
    RefreshCw,
    Users,
    User,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Shield,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    CreditCard,
    ShoppingBag,
    Activity,
    UserCheck,
    UserX
} from "lucide-react";
import api from "../../serviceAuth/axios";

export default function CustomerList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        role: "customer",
        isActive: "",
        isBlocked: "",
    });

    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({});

    //   const [statusModal, setStatusModal] = useState({
    //     open: false,
    //     userId: null,
    //     isBlocked: true,
    //     currentStatus: false
    //   });

    const [statusModal, setStatusModal] = useState({
        open: false,
        userId: null,
        isActive: true,
    });

    const [blockReason, setBlockReason] = useState("");

    // Stats calculation
    const stats = useMemo(() => {
        return {
            total: totalCount,
            active: data.filter(c => c.isActive && !c.isBlocked).length,
            blocked: data.filter(c => c.isBlocked).length,
            verified: data.filter(c => c.isVerified).length,
        };
    }, [data, totalCount]);

    /* 🔥 DEBOUNCE */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters.search]);

    /* 🔥 FETCH CUSTOMERS */
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
                limit,
                role: "customer",
                ...filters,
                search: debouncedSearch,
                isActive: filters.isActive === "" ? undefined : filters.isActive,
                isBlocked: filters.isBlocked === "" ? undefined : filters.isBlocked,
            };

            // Remove undefined values
            Object.keys(params).forEach(key => {
                if (params[key] === undefined || params[key] === "") {
                    delete params[key];
                }
            });

            const res = await api.get("/auth/alluser", { params });

            setData(res.data.users || []);
            setTotalPages(res.data.pagination.totalPages || 1);
            setTotalCount(res.data.pagination.totalUsers || 0);
            setPaginationInfo(res.data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load customers");
            Swal.fire("Error", "Failed to load customers", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [debouncedSearch, filters.isActive, filters.isBlocked, page, limit]);

    /* 🔥 VIEW CUSTOMER DETAILS */
    const handleView = async (customer) => {
        setSelectedCustomer(customer);
    };

    /* 🔥 RESET FILTERS */
    const resetFilters = () => {
        setFilters({
            search: "",
            role: "customer",
            isActive: "",
            isBlocked: "",
        });
        setPage(1);
    };

    /* 🔥 REFRESH */
    const handleRefresh = () => {
        fetchCustomers();
    };

    /* 🔥 UPDATE USER STATUS (BLOCK/UNBLOCK) */
    //   const updateStatus = async () => {
    //     if (!statusModal.isBlocked && !blockReason.trim()) {
    //       Swal.fire("Warning", "Please provide a reason for blocking", "warning");
    //       return;
    //     }

    //     try {
    //       await api.put(`/auth/update/user/status/${statusModal.userId}`, {
    //         isActive: !statusModal.isBlocked,
    //         isBlocked: statusModal.isBlocked,
    //         blockReason: statusModal.isBlocked ? blockReason : "",
    //       });

    //       Swal.fire("Success", `Customer ${statusModal.isBlocked ? "blocked" : "unblocked"} successfully`, "success");

    //       setStatusModal({ open: false, userId: null, isBlocked: true, currentStatus: false });
    //       setBlockReason("");
    //       fetchCustomers(); // refresh list
    //     } catch (err) {
    //       Swal.fire("Error", err.response?.data?.message || "Failed to update status", "error");
    //     }
    //   };

    const updateStatus = async () => {
        try {
            await api.put(`/auth/update/user/status/${statusModal.userId}`, {
                isActive: statusModal.isActive,
                blockReason: statusModal.isActive ? "" : blockReason,
            });

            Swal.fire("Success", "Status updated successfully", "success");

            setStatusModal({ open: false, userId: null, isActive: true });
            setBlockReason("");

            fetchCustomers();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed", "error");
        }
    };

    const getStatusBadge = (customer) => {
        if (customer.isBlocked) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <UserX className="w-3 h-3" />
                    Blocked
                </span>
            );
        }
        if (customer.isActive) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <UserCheck className="w-3 h-3" />
                    Active
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <AlertCircle className="w-3 h-3" />
                Inactive
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customer Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and monitor all customer accounts</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {(filters.isActive || filters.isBlocked || filters.search) && (
                                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Customers</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <UserCheck className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Blocked Customers</p>
                                <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <UserX className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Verified</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.verified}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Shield className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Filter Customers</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Name, email, mobile, ID..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.isActive}
                                    onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                                >
                                    <option value="">All</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>

                            {/* Block Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Block Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.isBlocked}
                                    onChange={(e) => setFilters({ ...filters, isBlocked: e.target.value })}
                                >
                                    <option value="">All</option>
                                    <option value="true">Blocked</option>
                                    <option value="false">Not Blocked</option>
                                </select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                                            <span className="text-gray-500">Loading customers...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-8 h-8 text-gray-400" />
                                            <p className="text-gray-500">No customers found</p>
                                            {(filters.search || filters.isActive || filters.isBlocked) && (
                                                <button
                                                    onClick={resetFilters}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                                    {customer.avatar ? (
                                                        <img
                                                            src={customer.avatar.startsWith('http') ? customer.avatar : `http://localhost:5000${customer.avatar}`}
                                                            alt={customer.name || "Customer"}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://www.clipartmax.com/png/full/144-1442578_flat-person-icon-download-dummy-man.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{customer.name || "N/A"}</p>
                                                    <p className="text-xs text-gray-500">ID: {customer._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                {customer.email && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate max-w-[150px]">{customer.email}</span>
                                                    </div>
                                                )}
                                                {customer.mobile && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{customer.mobile}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-mono text-gray-600">
                                                {customer.platformId || "-"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(customer)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {customer.isVerified ? (
                                                <span className="inline-flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-sm">Verified</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-yellow-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-sm">Pending</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-gray-600">
                                                {customer.lastLogin ? formatDate(customer.lastLogin) : "-"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(customer.createdAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleView(customer)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {/* <button
                        onClick={() =>
                          setStatusModal({
                            open: true,
                            userId: customer._id,
                            isBlocked: !customer.isBlocked,
                            currentStatus: customer.isBlocked
                          })
                        }
                        className={`ml-2 px-3 py-1 text-xs rounded-lg ${
                          customer.isBlocked
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        } transition-colors`}
                      >
                        {customer.isBlocked ? "Unblock" : "Block"}
                      </button> */}

                                            <button
                                                onClick={() =>
                                                    setStatusModal({
                                                        open: true,
                                                        userId: customer._id,
                                                        isActive: !customer.isActive,
                                                    })
                                                }
                                                className={`ml-2 px-3 py-1 text-xs rounded-lg ${customer.isActive
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                <span
                                                    className={`text-xs px-2 py-1 rounded ${customer.isActive
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                        }`}
                                                >
                                                    {customer.isActive ? "Active" : "Blocked"}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalCount > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} customers
                            </span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value={10}>10 / page</option>
                                <option value={25}>25 / page</option>
                                <option value={50}>50 / page</option>
                                <option value={100}>100 / page</option>
                            </select>
                        </div>
                        

                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                            >
                                First
                            </button>
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 text-sm text-gray-700">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage(totalPages)}
                                disabled={page === totalPages}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <CustomerModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    onUpdate={fetchCustomers}
                />
            )}

            {/* Block/Unblock Modal */}
            {statusModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 animate-fadeIn">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            {/* <h2 className="text-xl font-semibold text-gray-800">
                {statusModal.isBlocked ? "Block Customer" : "Unblock Customer"}
              </h2> */}
                            <h2 className="text-xl font-semibold text-gray-800">
                                {statusModal.isActive ? "Activate Customer" : "Deactivate Customer"}
                            </h2>
                            <button
                                onClick={() => setStatusModal({ open: false })}
                                className="text-gray-400 hover:text-gray-600 text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Info Message */}
                        <p className="text-sm text-gray-500 mb-4">
                            {statusModal.isActive
                                ? "This customer will be able to access the platform again."
                                : "This customer will be blocked and logged out immediately."}
                        </p>

                        {/* Reason Input (only for blocking) */}
                        {/* {statusModal.isActive && ( */}
                        {!statusModal.isActive && (
                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Block Reason <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Enter reason for blocking..."
                                    className="w-full mt-1 border border-gray-300 focus:border-red-400 focus:ring-1 focus:ring-red-200 p-2 rounded-lg outline-none transition"
                                    rows={3}
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                // onClick={() => setStatusModal({ open: false })}
                                onClick={() =>
                                    setStatusModal({ open: false, userId: null, isActive: true })
                                }
                                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            {/* <button
                onClick={updateStatus}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  statusModal.isBlocked
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {statusModal.isBlocked ? "Block Customer" : "Unblock Customer"}
              </button> */}

                            <button
                                onClick={updateStatus}
                                className={`px-4 py-2 rounded-lg text-white ${statusModal.isActive
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                    }`}
                            >
                                {statusModal.isActive ? "Activate" : "Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Customer Details Modal Component
function CustomerModal({ customer, onClose, onUpdate }) {
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            {customer.avatar ? (
                                <img
                                    src={customer.avatar.startsWith('http') ? customer.avatar : `http://localhost:5000${customer.avatar}`}
                                    alt={customer.name || "Customer"}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://www.clipartmax.com/png/full/144-1442578_flat-person-icon-download-dummy-man.png";
                                    }}
                                />
                            ) : (
                                <User className="w-6 h-6" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{customer.name || "Customer Details"}</h2>
                            <p className="text-sm text-blue-100">ID: {customer._id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-1 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="text-sm font-medium text-gray-800">{customer.name || "Not provided"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Platform ID</p>
                                <p className="text-sm font-mono text-gray-800">{customer.platformId || "Not assigned"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Role</p>
                                <p className="text-sm capitalize text-gray-800">{customer.role || "customer"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Mobile Number</p>
                                <p className="text-sm text-gray-800">{customer.mobile || "Not provided"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500">Email Address</p>
                                <p className="text-sm text-gray-800">{customer.email || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            Account Status
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Account Status</p>
                                <div className="mt-1">
                                    {customer.isBlocked ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                            <UserX className="w-3 h-3" />
                                            Blocked
                                        </span>
                                    ) : customer.isActive ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            <UserCheck className="w-3 h-3" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            <AlertCircle className="w-3 h-3" />
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Verification Status</p>
                                <div className="mt-1">
                                    {customer.isVerified ? (
                                        <span className="inline-flex items-center gap-1 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-yellow-600">
                                            <Clock className="w-4 h-4" />
                                            Pending Verification
                                        </span>
                                    )}
                                </div>
                            </div>
                            {customer.blockReason && (
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500">Block Reason</p>
                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg mt-1">
                                        {customer.blockReason}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" />
                            Activity Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Account Created</p>
                                <p className="text-sm text-gray-800">{formatDate(customer.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Last Login</p>
                                <p className="text-sm text-gray-800">{formatDate(customer.lastLogin)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Last Updated</p>
                                <p className="text-sm text-gray-800">{formatDate(customer.updatedAt)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Force Logout</p>
                                <p className="text-sm text-gray-800">{customer.forceLogout ? "Yes" : "No"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}