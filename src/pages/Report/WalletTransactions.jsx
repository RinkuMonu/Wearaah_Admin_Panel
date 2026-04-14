// pages/admin/WalletTransactions.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  FileText,
  ShoppingBag,
  Truck,
  RefreshCw as RefundIcon,
  AlertTriangle,
  Copy,
  Check,
  Phone,
} from "lucide-react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import { debounce } from "lodash";

export default function WalletTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    type: "",
    reasonSource: "",
    status: "",
    ownerId: "",
    walletId: "",
    referenceId: "",
    minAmount: "",
    maxAmount: "",
    fromDate: "",
    toDate: "",
  });

  // Search debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [limit, setLimit] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    totalCompletedAmount: 0,
    totalCreditAmount: 0,
    totalDebitAmount: 0,
    totalFailedAmount: 0,
    totalPendingAmount: 0,
  });

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
        type: filters.type || undefined,
        reasonSource: filters.reasonSource || undefined,
        status: filters.status || undefined,
        ownerId: filters.ownerId || undefined,
        walletId: filters.walletId || undefined,
        referenceId: filters.referenceId || undefined,
        minAmount: filters.minAmount || undefined,
        maxAmount: filters.maxAmount || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        search: debouncedSearchTerm || undefined,
      };

      const res = await api.get("/trancation", { params });

      if (res.data.success) {
        setTransactions(res.data.data || []);
        setTotalPages(res.data.pages || 1);
        setTotalTransactions(res.data.total || 0);
        setStats(res.data?.statData || {});
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    page,
    limit,
    filters.type,
    filters.reasonSource,
    filters.status,
    filters.minAmount,
    filters.maxAmount,
    filters.fromDate,
    filters.toDate,
    debouncedSearchTerm,
  ]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      reasonSource: "",
      status: "",
      ownerId: "",
      walletId: "",
      referenceId: "",
      minAmount: "",
      maxAmount: "",
      fromDate: "",
      toDate: "",
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setPage(1);
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(type);
      setTimeout(() => setCopiedId(null), 2000);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: `${type} copied to clipboard`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to copy", "error");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Transaction ID",
      "Type",
      "Amount",
      "Status",
      "Reason",
      "Description",
      "Reference ID",
      "Date",
      "Balance After",
    ];

    const csvData = transactions.map((t) => [
      t.transactionId,
      t.type.toUpperCase(),
      t.amount,
      t.status.toUpperCase(),
      t.reasonSource,
      t.description,
      t.referenceId || "-",
      new Date(t.createdAt).toLocaleString(),
      t.balanceAfter,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet_transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    Swal.fire("Success", "CSV exported successfully", "success");
  };

  const getTypeBadge = (type) => {
    if (type === "credit") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <ArrowUpCircle className="w-3 h-3" />
          Credit
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <ArrowDownCircle className="w-3 h-3" />
        Debit
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Completed",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      failed: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Failed",
      },
    };

    const { color, icon: Icon, label } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
      >
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const getReasonIcon = (reason) => {
    const icons = {
      order_payment: <ShoppingBag className="w-4 h-4" />,
      refund: <RefundIcon className="w-4 h-4" />,
      delivery_earning: <Truck className="w-4 h-4" />,
      commission: <DollarSign className="w-4 h-4" />,
      wallet_topup: <CreditCard className="w-4 h-4" />,
      withdrawal: <ArrowDownCircle className="w-4 h-4" />,
      penalty: <AlertTriangle className="w-4 h-4" />,
    };
    return icons[reason] || <FileText className="w-4 h-4" />;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReasonSourceLabel = (reason) => {
    const labels = {
      order_payment: "Order Payment",
      refund: "Refund",
      delivery_earning: "Delivery Earning",
      commission: "Commission",
      wallet_topup: "Wallet Top-up",
      withdrawal: "Withdrawal",
      penalty: "Penalty",
      lock: "Lock",
      unlock: "Unlock",
      settlement: "Settlement",
    };
    return (
      labels[reason] ||
      reason?.replace(/_/g, " ")?.replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Wallet Transactions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage all wallet activities
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={transactions.length === 0}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.values(filters).some((v) => v) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={fetchTransactions}
              className="cursor-pointer p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Credit</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatAmount(stats.totalCreditAmount || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Debit</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatAmount(stats.totalDebitAmount || 0)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalCompletedAmount || 0}
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
                <p className="text-sm text-gray-500">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.totalPendingAmount || 0}
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
                <p className="text-sm text-gray-500">Failed Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.totalFailedAmount || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Transaction ID..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                debouncedSearch("");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Filter Transactions</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

              {/* Reason Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason Source
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.reasonSource}
                  onChange={(e) =>
                    handleFilterChange("reasonSource", e.target.value)
                  }
                >
                  <option value="">All Reasons</option>
                  <option value="order_payment">Order Payment</option>
                  <option value="refund">Refund</option>
                  <option value="delivery_earning">Delivery Earning</option>
                  <option value="commission">Commission</option>
                  <option value="wallet_topup">Wallet Top-up</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="penalty">Penalty</option>
                  <option value="settlement">Settlement</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Reference ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference ID
                </label>
                <input
                  type="text"
                  placeholder="Order ID / Withdrawal ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.referenceId}
                  onChange={(e) =>
                    handleFilterChange("referenceId", e.target.value)
                  }
                />
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.minAmount}
                    onChange={(e) =>
                      handleFilterChange("minAmount", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="10000"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.maxAmount}
                    onChange={(e) =>
                      handleFilterChange("maxAmount", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.fromDate}
                    onChange={(e) =>
                      handleFilterChange("fromDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.toDate}
                    onChange={(e) =>
                      handleFilterChange("toDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset All Filters
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

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Txn ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-500">
                        Loading transactions...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Wallet className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr
                    key={txn._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-600">
                          {txn.transactionId}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(txn.transactionId, "Transaction ID")
                          }
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy ID"
                        >
                          {copiedId === "Transaction ID" ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getTypeBadge(txn.type)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {txn.type === "credit" ? "+" : "-"}
                        {formatAmount(txn.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getReasonIcon(txn.reasonSource)}
                        <span className="text-sm text-gray-700">
                          {getReasonSourceLabel(txn.reasonSource)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(txn.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {txn.ownerId?.platformId || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(txn.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewDetails(txn)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalTransactions > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalTransactions)} of{" "}
                {totalTransactions} transactions
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
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                First
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Transaction Details
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedTransaction.transactionId}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Transaction Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Transaction ID:
                      </span>
                      <span className="font-mono text-sm">
                        {selectedTransaction.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      {getTypeBadge(selectedTransaction.type)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span
                        className={`font-semibold ${selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {selectedTransaction.type === "credit" ? "+" : "-"}
                        {formatAmount(selectedTransaction.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Balance After:
                      </span>
                      <span className="font-medium">
                        {formatAmount(selectedTransaction.balanceAfter)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reason & Reference */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Reason & Reference
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">
                        Reason Source:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {getReasonIcon(selectedTransaction.reasonSource)}
                        <span className="font-medium">
                          {getReasonSourceLabel(
                            selectedTransaction.reasonSource,
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Description:
                      </span>
                      <p className="text-sm text-gray-800 mt-1">
                        {selectedTransaction.description}
                      </p>
                    </div>
                    {/* {selectedTransaction.referenceId && (
                      <div>
                        <span className="text-sm text-gray-600">
                          Reference ID:
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-sm">
                            {selectedTransaction.referenceId}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                selectedTransaction.referenceId,
                                "Reference ID",
                              )
                            }
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {copiedId === "Reference ID" ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Model: {selectedTransaction.referenceModel}
                        </p>
                      </div>
                    )} */}
                  </div>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    User Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="font-mono text-sm">
                        {selectedTransaction.ownerId?.platformId || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Mobile:</span>
                      <span className="font-medium">
                        {selectedTransaction.ownerId?.mobile || "N/A"}
                      </span>
                    </div>
                    {selectedTransaction.ownerId?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="font-medium">
                          {selectedTransaction.ownerId?.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Wallet Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Available Balance:
                      </span>
                      <span className="font-medium">
                        {formatAmount(
                          selectedTransaction.walletId?.availableBalance || 0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Super Coin Balance:
                      </span>
                      <span className="font-medium">
                        {selectedTransaction.walletId?.superCoinBalance || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Timestamps
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Created At:</span>
                      <p className="font-medium mt-1">
                        {formatDate(selectedTransaction.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Updated At:</span>
                      <p className="font-medium mt-1">
                        {formatDate(selectedTransaction.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
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
