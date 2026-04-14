import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  User,
  Users,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  PhoneCall,
  TrendingUp,
  Download,
  Eye,
  Motorbike,
} from "lucide-react";
import api from "../../serviceAuth/axios";
import { debounce } from "lodash"; // You'll need to install lodash: npm install lodash
import Swal from "sweetalert2";

export default function LeadsPage() {
  const [statusModal, setStatusModal] = useState(false);
  const [statusLeadId, setStatusLeadId] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [statusNoteLoader, setStatusNoteLoader] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    leadType: "",
    status: "",
    businessType: "",
    leadSource: "",
    city: "",
    dateFrom: "",
    dateTo: "",
  });

  // Add a local search state for immediate input update
  const [localSearch, setLocalSearch] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);

  // Create debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        setFilters((prev) => ({ ...prev, search: searchValue }));
        setPage(1);
      }, 500),
    [],
  );
  const handleStatusChange = (leadId, status) => {
    setStatusLeadId(leadId);
    setStatusValue(status);
    setStatusNotes("");
    setStatusModal(true);
  };
  const updateLeadStatus = async () => {
    if (!statusNotes.trim()) {
      Swal.fire({
        icon: "info",
        title: "First enter note",
        showConfirmButton: true,
      });
      return;
    }
    try {
      setStatusNoteLoader(true);
      const res = await api.put(`/leads/${statusLeadId}/status`, {
        status: statusValue,
        notes: statusNotes,
      });

      if (res.data.success) {
        fetchLeads();
        setStatusModal(false);
      }
    } catch (err) {
      Swal.fire({
        icon: "info",
        title: err.response.data.message,
        showConfirmButton: true,
      });
    } finally {
      setStatusNoteLoader(false);
    }
  };
  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value); // Update local state immediately
    debouncedSearch(value); // Debounce the filter update
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      // Clean up filters - remove empty values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== undefined,
        ),
      );

      const params = { ...cleanFilters, page, limit };

      const res = await api.get("/leads", { params });

      if (res.data.success) {
        setLeads(res.data.leads || []);
        setTotal(res.data.total || 0);
      } else {
        setError(res.data.message || "Failed to fetch leads");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching leads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters, page, limit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For non-search filters, update immediately
    if (name !== "search") {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setPage(1);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      leadType: "",
      status: "",
      businessType: "",
      leadSource: "",
      city: "",
      dateFrom: "",
      dateTo: "",
    });
    setLocalSearch(""); // Clear local search as well
    setPage(1);
  };

  const handleRefresh = () => {
    fetchLeads();
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: "bg-blue-100 text-blue-800", icon: Clock },
      contacted: { color: "bg-yellow-100 text-yellow-800", icon: PhoneCall },
      converted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.new;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  const getLeadTypeBadge = (type) => {
    const typeConfig = {
      be_seller: {
        color: "bg-purple-100 text-purple-800",
        label: "Seller",
        icon: User, // Store the component reference, not JSX
      },
      be_rider: {
        color: "bg-orange-100 text-orange-800",
        label: "Rider",
        icon: Motorbike, // Using Bike icon for rider (Motorcycle)
      },
    };

    const config = typeConfig[type] || {
      color: "bg-gray-100 text-gray-800",
      label: type || "Unknown",
      icon: User, // Default icon
    };

    const IconComponent = config.icon; // Get the icon component

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getBusinessTypeBadge = (type) => {
    const typeConfig = {
      individual: { color: "bg-cyan-100 text-cyan-800", label: "Individual" },
      proprietorship: {
        color: "bg-indigo-100 text-indigo-800",
        label: "Proprietorship",
      },
      partnership: {
        color: "bg-violet-100 text-violet-800",
        label: "Partnership",
      },
      pvt_ltd: { color: "bg-fuchsia-100 text-fuchsia-800", label: "Pvt Ltd" },
    };

    const config = typeConfig[type] || {
      color: "bg-gray-100 text-gray-800",
      label: type || "-",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Building2 className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const totalPages = Math.ceil(total / limit);

  // Calculate stats based on current leads
  const stats = {
    total: total,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with Stats */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Leads Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all your leads in one place
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
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
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-800">{total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contacted</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.contacted}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <PhoneCall className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Converted</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.converted}
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
            <h3 className="font-semibold text-gray-800">Filter Leads</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name / Mobile / Email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={localSearch}
                    onChange={handleSearchChange}
                  />
                  {localSearch && localSearch !== filters.search && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {localSearch && localSearch !== filters.search && (
                  <p className="text-xs text-gray-500 mt-1">Searching...</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="leadType"
                  value={filters.leadType}
                  onChange={handleChange}
                >
                  <option value="">All Types</option>
                  <option value="be_seller">Seller</option>
                  <option value="be_rider">Rider</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="businessType"
                  value={filters.businessType}
                  onChange={handleChange}
                >
                  <option value="">All Business</option>
                  <option value="individual">Individual</option>
                  <option value="proprietorship">Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="pvt_ltd">Pvt Ltd</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="city"
                  value={filters.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <span className="text-gray-500">Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No leads found</p>
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
                leads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {lead.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{lead.mobile}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">
                              {lead.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {lead.city ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{lead.city}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {getLeadTypeBadge(lead.leadType)}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead._id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      {getBusinessTypeBadge(lead.businessType)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewLead(lead)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
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
        {leads.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} results
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

      {/* Lead Details Modal */}
      {showLeadDetails && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Lead Details</h3>
              <button
                onClick={() => {
                  setShowLeadDetails(false);
                  setSelectedLead(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedLead.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lead Type</p>
                      <div className="mt-1">
                        {getLeadTypeBadge(selectedLead.leadType)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedLead.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lead Source</p>
                      <p className="font-medium text-gray-900">
                        {selectedLead.leadSource || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="font-medium text-gray-900">
                        {selectedLead.mobile}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedLead.email || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">City</p>
                      <p className="font-medium text-gray-900">
                        {selectedLead.city || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">State</p>
                      <p className="font-medium text-gray-900">
                        {selectedLead.state || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                {selectedLead.businessType && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Business Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Business Type</p>
                        <div className="mt-1">
                          {getBusinessTypeBadge(selectedLead.businessType)}
                        </div>
                      </div>
                      {selectedLead.businessName && (
                        <div>
                          <p className="text-xs text-gray-500">Business Name</p>
                          <p className="font-medium text-gray-900">
                            {selectedLead.businessName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedLead.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    {selectedLead.notes && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Notes</p>
                        <p className="font-medium text-gray-900">
                          {selectedLead.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => {
                  setShowLeadDetails(false);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Notes Modal UI */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Update Lead Status</h3>

            <p className="text-sm text-gray-600 mb-2">
              Status: <b>{statusValue}</b>
            </p>

            <textarea
              placeholder="Enter notes..."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStatusModal(false)}
                className="px-3 py-2 bg-gray-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={updateLeadStatus}
                disabled={statusNoteLoader}
                className={`px-3 py-2 bg-blue-600 text-white rounded-lg  cursor-pointer ${statusNoteLoader && "cursor-not-allowed"}`}
              >
                {statusNoteLoader ? "updating" : "update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
