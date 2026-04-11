// pages/qc/QCProductsList.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Calendar,
  Store,
  Tag,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import VariantQCModal from "./QcViewModel";
import { useAuth } from "../../serviceAuth/context";

export default function QCProductsList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    sellerId: "",
    sort: "latest",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);

  // Filter options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sellers, setSellers] = useState([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchQCProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
        search: debouncedSearch || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        sellerId: filters.sellerId || undefined,
        sort: filters.sort || undefined,
      };

      const res = await api.get("/product/qc-products", { params });

      if (res.data.success) {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.count || 0);
      } else {
        setError(res.data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch QC products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [categoriesRes, brandsRes, sellersRes] = await Promise.all([
        api
          .get("/subcategory/nameonly") // ye api invetory me bi hai keep safe
          .catch(() => ({ data: { success: false } })),
        api.get("/brand/nameonly").catch(() => ({ data: { success: false } })),
        api
          .get("/seller/getseller")
          .catch(() => ({ data: { success: false } })),
      ]);

      if (categoriesRes.data.success)
        setCategories(categoriesRes.data.categories || []);
      if (brandsRes.data.success) setBrands(brandsRes.data.brands || []);
      if (sellersRes.data.success) setSellers(sellersRes.data.sellers || []);
    } catch (err) {
      console.error("Failed to fetch filter options", err);
    }
  };

  useEffect(() => {
    fetchQCProducts();
  }, [
    page,
    limit,
    debouncedSearch,
    filters.category,
    filters.brand,
    filters.sellerId,
    filters.sort,
  ]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      sellerId: "",
      sort: "latest",
    });
    setDebouncedSearch("");
    setPage(1);
  };

  const handleReviewVariants = (
    productId,
    productName,
    productSpecifications,
  ) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setShowVariantModal(true);
    setSelectedProduct(productSpecifications);
  };

  const stats = useMemo(() => {
    return {
      total: totalCount,
      pending: products.length,
    };
  }, [totalCount, products]);

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
              Quality Check Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and approve products with pending variants
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.category || filters.brand || filters.sellerId) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={fetchQCProducts}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pending QC</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
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
                <p className="text-sm text-gray-500">Current Page</p>
                <p className="text-2xl font-bold text-blue-600">
                  {page} / {totalPages}
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
                <p className="text-sm text-gray-500">Products to Review</p>
                <p className="text-2xl font-bold text-purple-600">
                  {products.length}
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
            <h3 className="font-semibold text-gray-800">Filter Products</h3>
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
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Product name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.brand}
                    onChange={(e) =>
                      handleFilterChange("brand", e.target.value)
                    }
                  >
                    <option value="">All Brands</option>
                    {brands?.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seller Filter */}
              {user?.user?.role !== "seller" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seller
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.sellerId}
                      onChange={(e) =>
                        handleFilterChange("sellerId", e.target.value)
                      }
                    >
                      <option value="">All Sellers</option>
                      {sellers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name || s.shopName || s.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
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
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Package className="w-12 h-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              No products pending QC
            </h3>
            <p className="text-sm text-gray-500">
              All products have been reviewed or none are pending quality check
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.productImage && product.productImage[0] ? (
                  <img
                    src={
                      import.meta.env.VITE_BASE_URL + product.productImage[0]
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    New Variants
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>

                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span>{product.brandId?.name || "No Brand"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FolderOpen className="w-4 h-4 text-gray-400" />
                    <span>{product.categoryId?.name || "No Category"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span>
                      {product.sellerId?.ownerName ||
                        product.sellerId?.email ||
                        "Fashion hub Seller"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Added: {formatDate(product.createdAt)}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() =>
                    handleReviewVariants(
                      product._id,
                      product.name,
                      product.specifications,
                    )
                  }
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Review Variants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalCount)} of {totalCount} products
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

      {/* Variant QC Modal */}
      {showVariantModal && selectedProductId && (
        <VariantQCModal
          productId={selectedProductId}
          productName={selectedProductName}
          productSpecifications={selectedProduct}
          onClose={() => {
            setShowVariantModal(false);
            setSelectedProductId(null);
            setSelectedProductName("");
          }}
          onSuccess={() => {
            fetchQCProducts();
          }}
        />
      )}
    </div>
  );
}
