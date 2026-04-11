import { useEffect, useState } from "react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: ""
  });

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const url = categoryFilter ? `/faq?category=${categoryFilter}` : "/faq";
      const res = await api.get(url);
      setFaqs(res.data.faqs);
      setFilteredFaqs(res.data.faqs);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.faqs.map(faq => faq.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      Swal.fire("Error", "Failed to fetch FAQs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [categoryFilter]);

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqs);
    }
  }, [searchTerm, faqs]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({ question: "", answer: "", category: "" });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (faq) => {
    setModalMode("edit");
    setSelectedFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setIsModalOpen(true);
  };

  // Open modal for view
  const handleView = (faq) => {
    setModalMode("view");
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    if (!formData.question || !formData.answer || !formData.category) {
      Swal.fire("Validation Error", "Please fill all fields", "warning");
      return;
    }

    try {
      if (modalMode === "create") {
        const res = await api.post("/faq", formData);
        if (res.data.success) {
          Swal.fire("Success", "FAQ created successfully", "success");
          fetchFaqs();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.put(`/faq/${selectedFaq._id}`, formData);
        if (res.data.success) {
          Swal.fire("Success", "FAQ updated successfully", "success");
          fetchFaqs();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      Swal.fire("Error", "Failed to save FAQ", "error");
    }
  };

  // Soft delete FAQ
  const handleDelete = async (faq) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `This FAQ "${faq.question}" will be deleted`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#927f68",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/faq/${faq._id}`);
      Swal.fire("Deleted!", "FAQ has been deleted", "success");
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      Swal.fire("Error", "Failed to delete FAQ", "error");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setCategoryFilter("");
    setSearchTerm("");
  };

  return (
    <div className="p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-[#f5efdd] p-4 rounded-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-[#927f68]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          FAQ Management
        </h2>
        <button
          onClick={handleCreate}
          className="bg-[#927f68] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a6a56] transition"
        >
          <Plus size={18} />
          Add New FAQ
        </button>
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
              placeholder="Search by question or answer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={14} className="inline mr-1" />
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {(searchTerm || categoryFilter) && (
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

      {/* FAQ Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#927f68] text-[#f5efdd]">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Question</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#927f68]"></div>
                  </div>
                </td>
              </tr>
            ) : filteredFaqs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No FAQs found
                </td>
              </tr>
            ) : (
              filteredFaqs.map((faq, index) => (
                <tr key={faq._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{index + 1}</td>
                  <td className="p-3 font-medium max-w-md">
                    <div className="truncate" title={faq.question}>
                      {faq.question}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-[#f5efdd] text-[#927f68] rounded-full text-xs font-medium">
                      {faq.category}
                    </span>
                  </td>
                  <td className="p-3">
                    {faq.isActive ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertCircle size={14} />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">
                    {faq.createdBy?.substring(0, 8)}...
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {new Date(faq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleView(faq)}
                        className="text-[#927f68] hover:bg-[#f5efdd] p-2 rounded-md transition"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(faq)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq)}
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

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="bg-[#927f68] text-[#f5efdd] px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {modalMode === "create" && "Create New FAQ"}
                {modalMode === "edit" && "Edit FAQ"}
                {modalMode === "view" && "FAQ Details"}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-800">
                      {selectedFaq?.question}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-800 whitespace-pre-wrap">
                      {selectedFaq?.answer}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="px-2 py-1 bg-[#f5efdd] text-[#927f68] rounded-full text-xs font-medium">
                        {selectedFaq?.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {selectedFaq?.isActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created At
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                        {new Date(selectedFaq?.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      placeholder="Enter the question"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="answer"
                      value={formData.answer}
                      onChange={handleInputChange}
                      placeholder="Enter the answer"
                      rows="5"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Order, Payment, General"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#927f68]"
                      list="categorySuggestions"
                    />
                    <datalist id="categorySuggestions">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: You can use existing categories or create new ones
                    </p>
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
              
              {modalMode !== "view" && (
                <button
                  onClick={handleSubmit}
                  className="bg-[#927f68] text-white px-6 py-2 rounded-lg hover:bg-[#7a6a56] transition"
                >
                  {modalMode === "create" ? "Create FAQ" : "Update FAQ"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}