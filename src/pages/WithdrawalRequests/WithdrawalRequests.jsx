// pages/admin/WithdrawalRequests.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  DollarSign,
  Building2,
  CreditCard,
  User,
  Calendar,
  Banknote,
  TrendingUp,
  TrendingDown,
  Loader2,
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../serviceAuth/axios";

export default function WithdrawalRequests() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "", 
    paymentMethod: "",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    processed: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    rejectedAmount: 0,
    processedAmount: 0,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch withdrawals
  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        paymentMethod: filters.paymentMethod || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      };

      const res = await api.get("/withdrawalreq/all", { params });

      if (res.data.success) {
        setWithdrawals(res.data.withdrawals || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
        setStats(
          res.data.stats || {
            pending: 0,
            approved: 0,
            rejected: 0,
            processed: 0,
            pendingAmount: 0,
            approvedAmount: 0,
            rejectedAmount: 0,
            processedAmount: 0,
          },
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch withdrawals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    filters.status,
    filters.paymentMethod,
    filters.dateFrom,
    filters.dateTo,
  ]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      status: "pending",
      paymentMethod: "",
      dateFrom: "",
      dateTo: "",
    });
    setPage(1);
  };

  // Approve withdrawal
  const handleApprove = async (withdrawalId) => {
    const result = await Swal.fire({
      title: "Approve Withdrawal?",
      text: "Are you sure you want to approve this withdrawal request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const res = await api.put(`/withdrawalreq/${withdrawalId}/approve`);

        if (res.data.success) {
          Swal.fire(
            "Approved!",
            "Withdrawal request has been approved and processed.",
            "success",
          );
          fetchWithdrawals();
          if (selectedRequest?._id === withdrawalId) {
            setShowDetails(false);
            setSelectedRequest(null);
          }
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to approve withdrawal",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Reject withdrawal
  const handleReject = async (withdrawalId) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Withdrawal",
      text: "Please provide a reason for rejection:",
      input: "textarea",
      inputPlaceholder: "Enter rejection reason...",
      inputAttributes: {
        "aria-label": "Rejection reason",
      },
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Rejection reason is required!";
        }
        if (value.length < 10) {
          return "Please provide a detailed reason (minimum 10 characters)";
        }
        return null;
      },
    });

    if (reason) {
      setLoading(true);
      try {
        const res = await api.put(`/withdrawalreq/${withdrawalId}/reject`, {
          reason,
        });

        if (res.data.success) {
          Swal.fire(
            "Rejected!",
            "Withdrawal request has been rejected and amount refunded.",
            "warning",
          );
          fetchWithdrawals();
          if (selectedRequest?._id === withdrawalId) {
            setShowDetails(false);
            setSelectedRequest(null);
          }
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to reject withdrawal",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // View details
  const handleViewDetails = (withdrawal) => {
    setSelectedRequest(withdrawal);
    setShowDetails(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      approved: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Rejected",
      },
      processed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Processed",
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
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Get payment method badge
  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      bank_transfer: {
        color: "bg-purple-100 text-purple-800",
        icon: Building2,
        label: "Bank Transfer",
      },
      upi: {
        color: "bg-green-100 text-green-800",
        icon: CreditCard,
        label: "UPI",
      },
    };

    const config = methodConfig[method] || {
      color: "bg-gray-100 text-gray-800",
      icon: Banknote,
      label: method,
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Withdrawal Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and process withdrawal requests from users
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.paymentMethod ||
                filters.dateFrom ||
                filters.dateTo) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={fetchWithdrawals}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(stats.pendingAmount)}
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
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.approved}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(stats.approvedAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(stats.rejectedAmount)}
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
                <p className="text-sm text-gray-500">Total Withdrawal</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.processed}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(stats.processedAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Filter Requests</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="processed">Processed</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.paymentMethod}
                  onChange={(e) =>
                    handleFilterChange("paymentMethod", e.target.value)
                  }
                >
                  <option value="">All Methods</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Request ID, User ID, Transaction ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
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

      {/* Withdrawals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-500">
                        Loading withdrawals...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Banknote className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">
                        No withdrawal requests found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {withdrawal.requestId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Txn:{" "}
                        {withdrawal.wallettransaction?.transactionId?.slice(-8)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {withdrawal.user?.platformId || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {withdrawal.user?._id?.slice(-6)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-lg text-gray-900">
                        {formatCurrency(withdrawal.amount)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {getPaymentMethodBadge(withdrawal.paymentMethod)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(withdrawal.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(withdrawal.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(withdrawal)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {withdrawal.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(withdrawal._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(withdrawal._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
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
                {Math.min(page * limit, totalCount)} of {totalCount} requests
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

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Withdrawal Request Details
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedRequest.requestId}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRequest(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Request ID</p>
                      <p className="font-medium text-gray-900">
                        {selectedRequest.requestId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedRequest.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Request Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {formatDate(selectedRequest.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">User ID</p>
                      <p className="font-medium text-gray-900">
                        {selectedRequest.user?.platformId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">User Mobile No.</p>
                      <p className="font-mono text-xs text-gray-600">
                        {selectedRequest.user?.mobile}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="font-mono text-xs text-gray-600">
                        {selectedRequest.wallettransaction?.transactionId ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Balance After</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(
                          selectedRequest.wallettransaction?.balanceAfter || 0,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Payment Method</p>
                      {getPaymentMethodBadge(selectedRequest.paymentMethod)}
                    </div>

                    {selectedRequest.paymentMethod === "bank_transfer" &&
                      selectedRequest.bankDetails && (
                        <>
                          <div>
                            <p className="text-xs text-gray-500">
                              Account Holder Name
                            </p>
                            <p className="font-medium text-gray-900">
                              {selectedRequest.bankDetails.accountHolderName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Account Number
                            </p>
                            <p className="font-medium text-gray-900">
                              ****
                              {selectedRequest.bankDetails.accountNumber?.slice(
                                -4,
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">IFSC Code</p>
                            <p className="font-medium text-gray-900 uppercase">
                              {selectedRequest.bankDetails.ifscCode}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Bank Name</p>
                            <p className="font-medium text-gray-900">
                              {selectedRequest.bankDetails.bankName}
                            </p>
                          </div>
                        </>
                      )}

                    {selectedRequest.paymentMethod === "upi" &&
                      selectedRequest.upiDetails && (
                        <>
                          <div>
                            <p className="text-xs text-gray-500">UPI ID</p>
                            <p className="font-medium text-gray-900">
                              {selectedRequest.upiDetails.upiId}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-medium text-gray-900">
                              {selectedRequest.upiDetails.name}
                            </p>
                          </div>
                        </>
                      )}
                  </div>
                </div>

                {/* Rejection Reason (if rejected) */}
                {selectedRequest.status === "rejected" &&
                  selectedRequest.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:col-span-2">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Rejection Reason
                      </h4>
                      <p className="text-red-700">
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Processing Information (if processed/approved) */}
                {(selectedRequest.status === "approved" ||
                  selectedRequest.status === "processed") &&
                  selectedRequest.processedAt && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:col-span-2">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Processing Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-blue-600">Processed By</p>
                          <p className="font-medium text-blue-900">
                            {selectedRequest.processedBy?.platformId || "Admin"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600">Processed At</p>
                          <p className="font-medium text-blue-900">
                            {formatDate(selectedRequest.processedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
              {selectedRequest.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      handleApprove(selectedRequest._id);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      handleReject(selectedRequest._id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Request
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
