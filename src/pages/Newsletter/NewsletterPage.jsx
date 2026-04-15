import { useEffect, useState } from "react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Mail,
  Send,
  RefreshCw,
  Calendar,
  Users,
  UserCheck,
  UserX,
  AtSign,
  Globe,
  XCircle
} from "lucide-react";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // edit, view
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state for edit
  const [formData, setFormData] = useState({
    email: "",
    isSubscribed: true,
    source: ""
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    subscribed: 0,
    unsubscribed: 0
  });

  // Fetch Subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/newsletter");
      setSubscribers(res.data.subscribers);
      setFilteredSubscribers(res.data.subscribers);
      
      // Calculate stats
      const total = res.data.subscribers.length;
      const subscribed = res.data.subscribers.filter(s => s.isSubscribed).length;
      const unsubscribed = total - subscribed;
      
      setStats({ total, subscribed, unsubscribed });
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      Swal.fire("Error", "Failed to fetch subscribers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Search and Filter
  useEffect(() => {
    let filtered = [...subscribers];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.source && sub.source.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(sub => 
        statusFilter === "subscribed" ? sub.isSubscribed : !sub.isSubscribed
      );
    }
    
    setFilteredSubscribers(filtered);
  }, [searchTerm, statusFilter, subscribers]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  // Open modal for edit
  const handleEdit = (subscriber) => {
    setModalMode("edit");
    setSelectedSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      isSubscribed: subscriber.isSubscribed,
      source: subscriber.source || ""
    });
    setIsModalOpen(true);
  };

  // Open modal for view
  const handleView = (subscriber) => {
    setModalMode("view");
    setSelectedSubscriber(subscriber);
    setIsModalOpen(true);
  };

  // Update subscriber
  const handleUpdate = async () => {
    if (!formData.email) {
      Swal.fire("Validation Error", "Email is required", "warning");
      return;
    }

    try {
      const res = await api.put(`/newsletter/${selectedSubscriber._id}`, {
        email: formData.email,
        isSubscribed: formData.isSubscribed,
        source: formData.source
      });
      
      if (res.data.success) {
        Swal.fire("Success", "Subscriber updated successfully", "success");
        fetchSubscribers();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating subscriber:", error);
      Swal.fire("Error", "Failed to update subscriber", "error");
    }
  };

  // Delete subscriber
  const handleDelete = async (subscriber) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Subscriber "${subscriber.email}" will be permanently deleted`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#927f68",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/newsletter/${subscriber._id}`);
      Swal.fire("Deleted!", "Subscriber has been deleted", "success");
      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      Swal.fire("Error", "Failed to delete subscriber", "error");
    }
  };

  // Toggle subscription status
  const handleToggleStatus = async (subscriber) => {
    const newStatus = !subscriber.isSubscribed;
    const action = newStatus ? "subscribe" : "unsubscribe";
    
    const confirm = await Swal.fire({
      title: `${newStatus ? "Subscribe" : "Unsubscribe"} User`,
      text: `Are you sure you want to ${action} ${subscriber.email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus ? "#10b981" : "#ef4444",
      confirmButtonText: `Yes, ${action}`
    });

    if (!confirm.isConfirmed) return;

    try {
      if (newStatus) {
        // Re-subscribe
        await api.post("/newsletter", { email: subscriber.email, source: "admin_manual" });
      } else {
        // Unsubscribe
        await api.put("/newsletter/unsubscribe", { email: subscriber.email });
      }
      
      Swal.fire("Success", `User ${action}d successfully`, "success");
      fetchSubscribers();
    } catch (error) {
      console.error("Error toggling status:", error);
      Swal.fire("Error", `Failed to ${action} user`, "error");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setStatusFilter("");
    setSearchTerm("");
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Email", "Status", "Source", "Subscribed Date", "Unsubscribed Date", "Created At"];
    const csvData = filteredSubscribers.map(sub => [
      sub.email,
      sub.isSubscribed ? "Subscribed" : "Unsubscribed",
      sub.source || "N/A",
      sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : "N/A",
      sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toLocaleString() : "N/A",
      new Date(sub.createdAt).toLocaleString()
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    Swal.fire("Success", "CSV exported successfully", "success");
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
    <div className="p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-[#f5efdd] p-4 rounded-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Mail className="h-6 w-6 text-[#927f68]" />
          Newsletter Subscribers
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            disabled={filteredSubscribers.length === 0}
          >
            <Send size={18} />
            Export CSV
          </button>
          <button
            onClick={fetchSubscribers}
            className="bg-[#927f68] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a6a56] transition"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Subscribers</p>
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
              <p className="text-sm text-gray-500">Active Subscribers</p>
              <p className="text-2xl font-bold text-green-600">{stats.subscribed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unsubscribed</p>
              <p className="text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search size={14} className="inline mr-1" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by email or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={14} className="inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
            >
              <option value="">All</option>
              <option value="subscribed">Subscribed</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>

          {(searchTerm || statusFilter) && (
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition mb-0.5"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#927f68] text-[#f5efdd]">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Subscribed At</th>
              <th className="p-3 text-left">Unsubscribed At</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#927f68]"></div>
                  </div>
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  No subscribers found
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((subscriber, index) => (
                <tr key={subscriber._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{index + 1}</td>
                  <td className="p-3 font-medium">
                    <div className="flex items-center gap-2">
                      <AtSign size={14} className="text-gray-400" />
                      <span className="truncate max-w-[200px]" title={subscriber.email}>
                        {subscriber.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    {subscriber.isSubscribed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} />
                        Subscribed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle size={12} />
                        Unsubscribed
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {subscriber.source ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        <Globe size={12} />
                        {subscriber.source}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {subscriber.subscribedAt ? formatDate(subscriber.subscribedAt) : "-"}
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {subscriber.unsubscribedAt ? formatDate(subscriber.unsubscribedAt) : "-"}
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(subscriber.createdAt)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleView(subscriber)}
                        className="text-[#927f68] hover:bg-[#f5efdd] p-2 rounded-md transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(subscriber)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(subscriber)}
                        className={`p-2 rounded-md transition ${
                          subscriber.isSubscribed 
                            ? "text-red-600 hover:bg-red-50" 
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={subscriber.isSubscribed ? "Unsubscribe" : "Subscribe"}
                      >
                        {subscriber.isSubscribed ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(subscriber)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-md transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for View/Edit */}
      {isModalOpen && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[550px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="bg-[#927f68] text-[#f5efdd] px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail size={20} />
                {modalMode === "view" ? "Subscriber Details" : "Edit Subscriber"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#f5efdd] hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {modalMode === "view" ? (
                // View Mode
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-800 break-all">{selectedSubscriber.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <div className="mt-1">
                          {selectedSubscriber.isSubscribed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} />
                              Subscribed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} />
                              Unsubscribed
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Source</p>
                        <p className="text-gray-800">{selectedSubscriber.source || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Subscribed Date</p>
                        <p className="text-gray-800">{formatDate(selectedSubscriber.subscribedAt)}</p>
                      </div>
                      {selectedSubscriber.unsubscribedAt && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Unsubscribed Date</p>
                          <p className="text-gray-800">{formatDate(selectedSubscriber.unsubscribedAt)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Created At</p>
                        <p className="text-gray-800">{formatDate(selectedSubscriber.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-gray-800">{formatDate(selectedSubscriber.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isSubscribed"
                          value="true"
                          checked={formData.isSubscribed === true}
                          onChange={() => setFormData(prev => ({ ...prev, isSubscribed: true }))}
                          className="w-4 h-4 text-[#927f68]"
                        />
                        <span className="text-sm text-green-600">Subscribed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="isSubscribed"
                          value="false"
                          checked={formData.isSubscribed === false}
                          onChange={() => setFormData(prev => ({ ...prev, isSubscribed: false }))}
                          className="w-4 h-4 text-[#927f68]"
                        />
                        <span className="text-sm text-red-600">Unsubscribed</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
                    >
                      <option value="">Select source</option>
                      <option value="footer">Footer</option>
                      <option value="popup">Popup</option>
                      <option value="checkout">Checkout</option>
                      <option value="admin_manual">Admin Manual</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
              
              {modalMode === "edit" && (
                <button
                  onClick={handleUpdate}
                  className="bg-[#927f68] text-white px-6 py-2 rounded-lg hover:bg-[#7a6a56] transition"
                >
                  Update Subscriber
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}