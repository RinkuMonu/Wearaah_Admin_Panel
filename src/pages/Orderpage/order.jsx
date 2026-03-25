import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  X,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CreditCard,
  IndianRupee,
  PackageCheck,
  PackageX,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import { useAuth } from "../../serviceAuth/context";

export const OrdersPage = () => {
  const { user, setUnseenCount, unseenCount } = useAuth();
  let userId = user.user?._id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Filters
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [settlementStatus, setSettlementStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);

  // Selected order for details view
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
        orderNumber: search || undefined,
        orderStatus: orderStatus || undefined,
        settlementStatus: settlementStatus || undefined,
        paymentMethod: paymentMethod || undefined,
        dateFrom: dateRange.from || undefined,
        dateTo: dateRange.to || undefined,
      };

      const res = await api.get("/order/my", { params });

      if (res.data.success) {
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (unseenCount > 0) {
      const markSeen = async () => {
        try {
          await api.put("/order/mark-seen");
          setUnseenCount(0);
        } catch (err) {
          console.log(err);
        }
      };
      markSeen();
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, limit, orderStatus, settlementStatus, paymentMethod]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const resetFilters = () => {
    setSearch("");
    setOrderStatus("");
    setSettlementStatus("");
    setPaymentMethod("");
    setDateRange({ from: "", to: "" });
    setPage(1);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      placed: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        label: "Placed",
      },
      packed: {
        color: "bg-purple-100 text-purple-800",
        icon: Package,
        label: "Packed",
      },
      shipped: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Truck,
        label: "Shipped",
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Cancelled",
      },
      returned: {
        color: "bg-orange-100 text-orange-800",
        icon: PackageX,
        label: "Returned",
      },
    };

    const config = statusConfig[status] || statusConfig.placed;
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

  const getSettlementBadge = (status) => {
    const statusConfig = {
      locked: { color: "bg-yellow-100 text-yellow-800", label: "Locked" },
      settled: { color: "bg-green-100 text-green-800", label: "Settled" },
      refunded: { color: "bg-red-100 text-red-800", label: "Refunded" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status || "N/A",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (method) => {
    const methodConfig = {
      COD: { color: "bg-orange-100 text-orange-800", label: "COD" },
      ONLINE: { color: "bg-green-100 text-green-800", label: "Online" },
      UPI: { color: "bg-green-100 text-green-800", label: "UPI" },
      WALLET: { color: "bg-blue-100 text-blue-800", label: "Wallet" },
    };

    const config = methodConfig[method] || {
      color: "bg-gray-100 text-gray-800",
      label: method,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Orders Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage all your orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(orderStatus ||
                settlementStatus ||
                paymentMethod ||
                dateRange.from ||
                dateRange.to) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={fetchOrders}
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
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.orderStatus === "delivered").length}
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
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    orders.filter(
                      (o) =>
                        o.orderStatus === "placed" ||
                        o.orderStatus === "packed" ||
                        o.orderStatus === "shipped",
                    ).length
                  }
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
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹
                  {orders
                    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Filter Orders</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Order
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Order number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Order Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="placed">Placed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Settlement Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Settlement Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={settlementStatus}
                  onChange={(e) => setSettlementStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="locked">Locked</option>
                  <option value="settled">Settled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="COD">COD</option>
                  <option value="UPI">UPI</option>
                  <option value="WALLET">Wallet</option>
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
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
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
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settlement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-500">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.shippingAddress?.fullName || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.shippingAddress?.mobile}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {order.items?.length || 0} items
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                      {order.deliveryCharge > 0 && (
                        <p className="text-xs text-gray-500">
                          +₹{order.deliveryCharge} delivery
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getPaymentBadge(order.paymentMethod)}
                      <p className="text-xs text-gray-500 mt-1 uppercase">
                        {order.paymentStatus}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-4 py-3">
                      {getSettlementBadge(order.settlementStatus)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewOrder(order)}
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
        {orders.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalCount)} of {totalCount} orders
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Order Details
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Order Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">
                          {formatDate(selectedOrder.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order Status:</span>
                        <span>{getStatusBadge(selectedOrder.orderStatus)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Method:</span>
                        <span>
                          {getPaymentBadge(selectedOrder.paymentMethod)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Status:</span>
                        <span
                          className={`font-medium ${selectedOrder.isPaid ? "text-green-600" : "text-red-600"}`}
                        >
                          {selectedOrder.isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Settlement:</span>
                        <span>
                          {getSettlementBadge(selectedOrder.settlementStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Shipping Address
                    </h4>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        {selectedOrder.shippingAddress?.fullName}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{selectedOrder.shippingAddress?.mobile}</span>
                      </div>
                      <div className="flex items-start gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                        <span>
                          {selectedOrder.shippingAddress?.street}
                          {selectedOrder.shippingAddress?.landmark &&
                            `, ${selectedOrder.shippingAddress?.landmark}`}
                          <br />
                          {selectedOrder.shippingAddress?.city},{" "}
                          {selectedOrder.shippingAddress?.state}
                          <br />
                          {selectedOrder.shippingAddress?.pincode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Price Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">
                          ₹{selectedOrder.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Charge:</span>
                        <span className="font-medium">
                          ₹{selectedOrder.deliveryCharge?.toLocaleString()}
                        </span>
                      </div>
                      {selectedOrder.coinUsed > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Coins Used:</span>
                          <span className="font-medium text-green-600">
                            -₹{selectedOrder.coinUsed}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 my-2 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Final Amount:</span>
                          <span className="text-blue-600">
                            ₹
                            {selectedOrder.finalAmoutAfterCoinDeliverycharges?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Platform Commission:
                        </span>
                        <span className="font-medium text-orange-600">
                          -₹{selectedOrder.platformCommission?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Your Earnings:</span>
                        <span className="text-green-600">
                          ₹{selectedOrder.sellerAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Order Items
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Variant
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                SKU: {item.sku}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Size: {item.size}</span>
                              <span className="text-sm">
                                Color: {item.color}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-gray-600 line-through text-xs">
                              ₹{item.mrp}
                            </span>
                            <br />
                            <span className="font-medium">
                              ₹{item.sellingPrice}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            ₹{item.totalAmountofqty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
