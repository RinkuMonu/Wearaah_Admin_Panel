// pages/admin/SellerList.jsx
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  Eye,
  Search,
  Filter,
  X,
  RefreshCw,
  Store,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Shield,
  Building2,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  CreditCard,
  Package,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../serviceAuth/axios";
import { SellerModal } from "../UserManagement/sellerViewModal";

export default function PendingKycSellerList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    kycStatus: "",
    kycStep: "",
    isApproved: "",
    onlyPendingAndSubmit: true,
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);

  const [statusModal, setStatusModal] = useState({
    open: false,
    sellerId: null,
    isActive: true,
  });

  const [blockReason, setBlockReason] = useState("");

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: data.length,
      verified: data.filter((s) => s.kycStatus === "verified").length,
      pending: data.filter((s) => s.kycStatus === "pending").length,
      rejected: data.filter((s) => s.kycStatus === "rejected").length,
      approved: data.filter((s) => s.isApproved).length,
    };
  }, [data]);

  /* 🔥 DEBOUNCE */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  /* 🔥 FETCH */
  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/seller/getseller", {
        params: {
          ...filters,
          search: debouncedSearch,
          page,
          limit,
        },
      });

      setData(res.data.sellers || []);
      // setTotalPages(res.data.totalPages || 1);
      // setTotalCount(res.data.totalCount || 0);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sellers");
      Swal.fire("Error", "Failed to load sellers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [
    debouncedSearch,
    filters.kycStatus,
    filters.kycStep,
    filters.isApproved,
    page,
    limit,
  ]);

  /* 🔥 VIEW SELLER */
  const handleView = async (id) => {
    try {
      const res = await api.get(`/seller/getseller/${id}`);
      setSelectedSeller(res.data.seller);
    } catch {
      Swal.fire("Error", "Failed to fetch seller", "error");
    }
  };

  /* 🔥 RESET FILTERS */
  const resetFilters = () => {
    setFilters({
      search: "",
      kycStatus: "",
      kycStep: "",
      isApproved: "",
    });
    setPage(1);
  };

  /* 🔥 REFRESH */
  const handleRefresh = () => {
    fetchSellers();
  };

  const getKYCStatusBadge = (status) => {
    const statusConfig = {
      verified: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Verified",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      submitted: {
        color: "bg-blue-100 text-blue-800",
        icon: FileText,
        label: "Submitted",
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
      label: status,
    };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const updateStatus = async () => {
    try {
      await api.put(`/auth/update/user/status/${statusModal.sellerId}`, {
        isActive: statusModal.isActive,
        blockReason: statusModal.isActive ? "" : blockReason,
      });

      Swal.fire("Success", "Status updated successfully", "success");

      setStatusModal({ open: false, sellerId: null, isActive: true });
      setBlockReason("");

      fetchSellers(); // refresh list
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Seller Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all seller accounts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.kycStatus || filters.kycStep || filters.isApproved) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sellers</p>
                <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Store className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">KYC Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.verified}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">KYC Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">KYC Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.approved}
                </p>
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
            <h3 className="font-semibold text-gray-800">Filter Sellers</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* KYC Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KYC Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.kycStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, kycStatus: e.target.value })
                  }
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  {/* <option value="verified">Verified</option> */}
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* KYC Step */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KYC Step
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.kycStep}
                  onChange={(e) =>
                    setFilters({ ...filters, kycStep: e.target.value })
                  }
                >
                  <option value="">All Steps</option>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>
                      Step {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Approval Status */}
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

      {/* Sellers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC Step
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                      <span className="text-gray-500">Loading sellers...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Store className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No sellers found</p>
                      {(filters.search ||
                        filters.kycStatus ||
                        filters.kycStep ||
                        filters.isApproved) && (
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
                data.map((seller) => (
                  <tr
                    key={seller._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Store className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {seller.shopName || "Not provided"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {seller.userId?.platformId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {" "}
                          {seller.userId?.name || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{seller.userId?.mobile || "-"}</span>
                        </div>
                        {seller.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">
                              {seller.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(seller.kycStep / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 ml-2">
                          Step {seller.kycStep}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getKYCStatusBadge(seller.kycStatus)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(seller.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleView(seller._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Activate / Deactivate Button */}
                      <button
                        onClick={() =>
                          setStatusModal({
                            open: true,
                            sellerId: seller.userId?._id,
                            isActive: !seller.userId?.isActive,
                          })
                        }
                        className={`px-3 py-1 text-xs rounded-lg ${
                          seller.userId?.isActive
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {/* {seller.userId?.isActive ? "Deactivate" : "Activate"} */}
                        <span
                          className={`text-xs px-2 py-1 rounded cursor-pointer ${
                            seller.userId?.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {seller.userId?.isActive ? "Active" : "Blocked"}
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/profile?id=${seller.userId?._id}`)
                        }
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit seller"
                      >
                        ✏️
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
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalCount)} of {totalCount} sellers
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

      {/* Seller Modal */}
      {selectedSeller && (
        <SellerModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          onUpdate={fetchSellers}
        />
      )}

      {statusModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {statusModal.isActive ? "Activate Seller" : "Deactivate Seller"}
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
                ? "This seller will be able to access the platform again."
                : "This seller will be blocked and logged out immediately."}
            </p>

            {/* Reason Input */}
            {!statusModal.isActive && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Block Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter reason for deactivation..."
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
                onClick={() => setStatusModal({ open: false })}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={updateStatus}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  statusModal.isActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
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
