// pages/admin/RiderList.jsx
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  Eye,
  Search,
  Filter,
  X,
  RefreshCw,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Bike,
  Car,
  Truck,
  Power,
  PowerOff,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import api from "../../serviceAuth/axios";
import { RiderModal } from "./RiderModal";

export default function RiderList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    city: "",
    vehicleType: "",
    kycStatus: "",
    status: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [stats, setStats] = useState({
    totalKycVerified: 0,
    totalBlocked: 0,
    totalActive: 0,
    totalSuspended: 0,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch riders list
  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (filters.city) params.append("city", filters.city);
      if (filters.vehicleType)
        params.append("vehicleType", filters.vehicleType);
      if (filters.kycStatus) params.append("kycStatus", filters.kycStatus);
      if (filters.status) params.append("status", filters.status);
      params.append("page", page);
      params.append("limit", limit);

      const res = await api.get(`/rider/getriders?${params.toString()}`);

      if (res.data.success) {
        setRiders(res.data.riders || []);
        setTotalCount(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      } else {
        throw new Error(res.data.message || "Failed to load riders");
      }
    } catch (err) {
      console.error("Fetch Riders Error:", err);
      setError(err.response?.data?.message || "Failed to load riders");
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to load riders",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, [
    debouncedSearch,
    filters.city,
    filters.vehicleType,
    filters.kycStatus,
    filters.status,
    page,
    limit,
  ]);

  // Handle view rider details - GET by ID API
  const handleView = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/rider/getriders/${id}`);
      if (res.data.success) {
        setSelectedRider(res.data.rider);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error("View Rider Error:", err);
      Swal.fire("Error", "Failed to fetch rider details", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle rider status (Activate/Deactivate)
  const handleChangeStatus = async (rider, newStatus) => {
    const riderId = rider._id;

    if (newStatus === rider.status) return;

    const result = await Swal.fire({
      title: "Change Rider Status?",
      text: `Are you sure you want to change status to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setStatusLoading(riderId);

      const res = await api.put(`/rider/updateRiderStatus/${riderId}`, {
        status: newStatus,
      });

      if (res.data.success) {
        Swal.fire("Success", "Status updated successfully", "success");
        fetchRiders(); // refresh list
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error("Status Update Error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update status",
        "error",
      );
    } finally {
      setStatusLoading(null);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      city: "",
      vehicleType: "",
      kycStatus: "",
      status: "",
    });
    setPage(1);
  };

  // Get KYC Status Badge
  const getKYCStatusBadge = (status) => {
    const config = {
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
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Rejected",
      },
    };
    const c = config[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
      label: status,
    };
    const Icon = c.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}
      >
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  // Get Status Badge
  const getStatusBadge = (status) => {
    const config = {
      active: {
        color: "bg-green-100 text-green-800",
        icon: UserCheck,
        label: "Active",
      },
      suspended: {
        color: "bg-orange-100 text-orange-800",
        icon: AlertCircle,
        label: "Suspended",
      },
      blocked: {
        color: "bg-red-100 text-red-800",
        icon: UserX,
        label: "Blocked",
      },
      inprogress: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        label: "In Progress",
      },
    };
    const c = config[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
      label: status,
    };
    const Icon = c.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}
      >
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  // Get Vehicle Icon
  const getVehicleIcon = (type) => {
    switch (type) {
      case "bike":
        return <Bike className="w-4 h-4" />;
      case "scooter":
        return <Bike className="w-4 h-4" />;
      case "EV":
        return <Car className="w-4 h-4" />;
      default:
        return <Truck className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Rider Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all delivery riders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.values(filters).some((v) => v) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={fetchRiders}
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
                <p className="text-sm text-gray-500">Total Riders</p>
                <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">KYC Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalKycVerified || 0}
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
                <p className="text-sm text-gray-500">Active Riders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalActive || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Blocked/Suspended</p>
                <p className="text-2xl font-bold text-red-600">
                  {(stats.totalBlocked || 0) + (stats.totalSuspended || 0)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Filter Riders</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name, mobile, email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={filters.vehicleType}
                  onChange={(e) =>
                    setFilters({ ...filters, vehicleType: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="cycle">Cycle</option>
                  <option value="EV">EV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KYC Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={filters.kycStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, kycStatus: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rider Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                  <option value="inprogress">In Progress</option>
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  Reset Filters
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

      {/* Riders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rider
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  KYC
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && riders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-gray-500">Loading riders...</span>
                    </div>
                  </td>
                </tr>
              ) : riders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <User className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No riders found</p>
                      {Object.values(filters).some((v) => v) && (
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
                riders.map((rider) => (
                  <tr
                    key={rider._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                          {rider.user?.avatar ? (
                            <img
                              src={rider.user.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {rider.user?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {rider.user?.platformId || rider._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-900">
                            {rider.user?.mobile || "N/A"}
                          </span>
                        </div>
                        {rider.user?.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">
                              {rider.user.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getVehicleIcon(rider.vehicleType)}
                        <span className="text-sm capitalize text-gray-900">
                          {rider.vehicleType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {rider.city || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getKYCStatusBadge(rider.kycStatus)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(rider.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(rider.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(rider._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={rider.status}
                          disabled={statusLoading === rider._id}
                          onChange={(e) =>
                            handleChangeStatus(rider, e.target.value)
                          }
                          className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="blocked">Blocked</option>
                          {/* <option value="inprogress">In Progress</option> */}
                        </select>
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
                {Math.min(page * limit, totalCount)} of {totalCount} riders
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

      {/* Rider View Modal */}
      {selectedRider && (
        <RiderModal
          rider={selectedRider}
          onClose={() => setSelectedRider(null)}
        />
      )}
    </div>
  );
}
