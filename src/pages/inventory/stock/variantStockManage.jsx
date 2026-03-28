// pages/inventory/VariantStockManagement.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Save,
  Eye,
  Filter as FilterIcon,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Settings,
  ShoppingBag,
  Tag,
  Palette,
  Ruler,
  DollarSign,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../serviceAuth/axios";
import { VariantViewModal } from "./VariantViewModal";

export default function VariantStockManagement() {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState({});

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    color: "",
    size: "",
    minPrice: "",
    maxPrice: "",
    lowStock: false,
    status: "",
    sort: "newest",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVariants, setTotalVariant] = useState(1);
  const [stats, setStats] = useState({});
  const [limit, setLimit] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  // Selected variants for bulk update
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchVariants = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
        search: filters.search || undefined,
        size: filters.size || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        lowStock: filters.lowStock ? "true" : undefined,
        status: filters.status || undefined,
        sort: filters.sort || undefined,
      };

      const res = await api.get("variant/admin/variants", { params });

      if (res.data.success) {
        setVariants(res.data.variants || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalVariant(res.data.totalVariants || 0);
        setStats(res.data?.stats);

        // Initialize stock values
        const stockValues = {};
        res.data.variants.forEach((v) => {
          stockValues[v._id] = v.stock;
        });
        setStockValue(stockValues);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch variants");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [page, limit, filters.sort, filters.lowStock, filters.status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        setPage(1);
        fetchVariants();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search, filters.size, filters.minPrice, filters.maxPrice]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      color: "",
      size: "",
      minPrice: "",
      maxPrice: "",
      lowStock: false,
      status: "",
      sort: "newest",
    });
    setPage(1);
  };

  const handleStockUpdate = async (variantId) => {
    const newStock = stockValue[variantId];
    const variant = variants.find((v) => v._id === variantId);

    if (newStock === variant.stock) {
      setEditingStock(null);
      return;
    }

    try {
      const res = await api.put(`/variant/bulkstockupdate`, {
        variants: [
          {
            id: variantId,
            stock: Number(newStock),
          },
        ],
      });

      if (res.data.success) {
        setVariants((prev) =>
          prev.map((v) =>
            v._id === variantId ? { ...v, stock: newStock } : v,
          ),
        );

        Swal.fire("Success", "Stock updated successfully", "success");
        fetchVariants();
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update stock",
        "error",
      );
    } finally {
      setEditingStock(null);
    }
  };

  const handleBulkStockUpdate = async () => {
    if (selectedVariants.length === 0) {
      Swal.fire(
        "No Selection",
        "Please select at least one variant",
        "warning",
      );
      return;
    }

    const { value: bulkStock } = await Swal.fire({
      title: "Bulk Stock Update",
      text: `Update stock for ${selectedVariants.length} variant(s)`,
      input: "number",
      inputLabel: "New Stock Quantity",
      inputPlaceholder: "Enter stock quantity",
      inputAttributes: {
        min: 0,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (bulkStock !== null && bulkStock >= 0) {
      setLoading(true);
      try {
        const payload = selectedVariants.map((variantId) => ({
          id: variantId,
          stock: Number(bulkStock),
        }));

        await api.put(`/variant/bulkstockupdate`, {
          variants: payload,
        });
        setVariants((prev) =>
          prev.map((v) =>
            selectedVariants.includes(v._id)
              ? { ...v, stock: Number(bulkStock) }
              : v,
          ),
        );

        setSelectedVariants([]);
        setSelectAll(false);
        Swal.fire(
          "Success",
          `Stock updated for ${selectedVariants.length} variant(s)`,
          "success",
        );
        fetchVariants();
      } catch (err) {
        Swal.fire("Error", "Failed to update some variants", "error");
      } finally {
        setLoading(false);
        setShowBulkUpdate(false);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVariants([]);
      setSelectAll(false);
    } else {
      setSelectedVariants(variants.map((v) => v._id));
      setSelectAll(true);
    }
  };

  const handleSelectVariant = (variantId) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId],
    );
  };

  const getStatusBadge = (status, isActive) => {
    if (!isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" />
          Inactive
        </span>
      );
    }

    const statusConfig = {
      approved: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Approved",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending QC",
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: AlertTriangle,
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

  const getStockStatusBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-red-600">
          <XCircle className="w-4 h-4" />
          <span className="font-medium">Out of Stock</span>
        </span>
      );
    } else if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 text-orange-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">Low Stock ({stock})</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">In Stock ({stock})</span>
        </span>
      );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Variant Stock Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor product variant inventory
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedVariants.length > 0 && (
              <button
                onClick={() => setShowBulkUpdate(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Bulk Update ({selectedVariants.length})
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FilterIcon className="w-4 h-4" />
              Filters
              {(filters.color ||
                filters.size ||
                filters.minPrice ||
                filters.maxPrice ||
                filters.lowStock ||
                filters.status) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={fetchVariants}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5  cursor-pointer ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Variants</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.inStock}
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
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.lowStock}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.outOfStock}
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
                <p className="text-sm text-gray-500">Pending QC</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingQC}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Filter Variants</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 cursor-pointer" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Variant Title, SKU..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Size */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g., M, L, XL"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.size}
                    onChange={(e) => handleFilterChange("size", e.target.value)}
                  />
                </div>
              </div> */}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending QC</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="10000"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Low Stock Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Filter
                </label>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={filters.lowStock}
                    onChange={(e) =>
                      handleFilterChange("lowStock", e.target.checked)
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 cursor-pointer">
                    Show Low Stock (≤5)
                  </span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="stock_asc">Stock (Low to High)</option>
                  <option value="stock_desc">Stock (High to Low)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
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

      {/* Variants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
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
                      <span className="text-gray-500">Loading variants...</span>
                    </div>
                  </td>
                </tr>
              ) : variants.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No variants found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                variants.map((variant) => (
                  <tr
                    key={variant._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedVariants.includes(variant._id)}
                        onChange={() => handleSelectVariant(variant._id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {variant.productId?.name || "N/A"}
                        </p>
                        {/* <p className="text-xs text-gray-500">
                          ID: {variant.productId?._id?.slice(-6)}
                        </p> */}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {variant.variantTitle}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Palette className="w-3 h-3" />
                            {variant.color}
                          </span>
                          <span className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            {variant.size}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-green-600">
                          {formatCurrency(variant.pricing?.sellingPrice)}
                        </p>
                        <p className="text-xs text-gray-500 line-through">
                          {formatCurrency(variant.pricing?.mrp)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingStock === variant._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={stockValue[variant._id]}
                            onChange={(e) =>
                              setStockValue((prev) => ({
                                ...prev,
                                [variant._id]: Math.max(
                                  0,
                                  parseInt(e.target.value) || 0,
                                ),
                              }))
                            }
                            className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            min="0"
                            autoFocus
                          />
                          <button
                            onClick={() => handleStockUpdate(variant._id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStock(null);
                              setStockValue((prev) => ({
                                ...prev,
                                [variant._id]: variant.stock,
                              }));
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getStockStatusBadge(variant.stock)}
                          <button
                            onClick={() => setEditingStock(variant._id)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit stock"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(variant.status, variant.isActive)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono text-gray-500">
                        {variant.sku}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedVariant(variant);
                          setShowViewModal(true);
                        }}
                        title="View More"
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
        {totalVariants > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalVariants)} of {totalVariants}{" "}
                variants
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

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Bulk Stock Update
              </h3>
              <button
                onClick={() => setShowBulkUpdate(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  You are about to update stock for{" "}
                  <span className="font-bold text-blue-600">
                    {selectedVariants.length}
                  </span>{" "}
                  variant(s)
                </p>
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      This action will update all selected variants to the same
                      stock quantity. Please ensure this is what you want.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowBulkUpdate(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkStockUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <VariantViewModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        variant={selectedVariant}
      />
    </div>
  );
}
