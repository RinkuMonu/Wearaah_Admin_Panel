// pages/inventory/product/ViewVariantsModal.jsx
import { useState, useEffect } from "react";
import {
  X,
  Edit2,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Package,
  Tag,
  DollarSign,
  Palette,
  Ruler,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import api from "../../../serviceAuth/axios";
import UpdateVariantModal from "./UpdateVariantModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function ViewVariantsModal({
  product,
  onClose,
  onVariantUpdate,
}) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [updatingStock, setUpdatingStock] = useState({});
  const [stockUpdateValues, setStockUpdateValues] = useState({});
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive, pending
  const [sortBy, setSortBy] = useState("stock"); // stock, price, discount

  useEffect(() => {
    if (product?._id) {
      fetchVariants();
    }
  }, [product]);

  const fetchVariants = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(
        `/variant/products/${product._id}/variants`,
      );
      if (response.data.success) {
        setVariants(response.data.variants || []);
        // Initialize stock update values
        const stockValues = {};
        response.data.variants.forEach((v) => {
          stockValues[v._id] = v.stock;
        });
        setStockUpdateValues(stockValues);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching variants");
      console.error("Error fetching variants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (variant) => {
    setSelectedVariant(variant);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (variant) => {
    setVariantToDelete(variant);
    setShowDeleteModal(true);
  };

  const handleUpdateSuccess = (updatedVariant) => {
    // Update the variants list
    setVariants((prev) =>
      prev.map((v) => (v._id === updatedVariant._id ? updatedVariant : v)),
    );
    setShowUpdateModal(false);
    setSelectedVariant(null);
    if (onVariantUpdate) onVariantUpdate(updatedVariant);
  };

  const handleDeleteSuccess = async () => {
    await fetchVariants(); // Refresh the list
    setShowDeleteModal(false);
    setVariantToDelete(null);
  };

  const handleStockUpdate = async (variantId) => {
    const newStock = stockUpdateValues[variantId];
    const variant = variants.find((v) => v._id === variantId);

    if (newStock === variant.stock) return; // No change

    setUpdatingStock((prev) => ({ ...prev, [variantId]: true }));
    setError("");

    try {
      const response = await api.put(`/variant/${variantId}`, {
        variantTitle: variant.variantTitle,
        variantDiscription: variant.variantDiscription,
        size: variant.size || variant.attributes?.size,
        color: variant.color || variant.attributes?.color,
        pricing: variant.pricing,
        stock: newStock,
      });

      if (response.data.success) {
        // Update the variant in the list
        setVariants((prev) =>
          prev.map((v) => (v._id === variantId ? response.data.variant : v)),
        );

        // Show success message (you can add a toast notification here)
        console.log("Stock updated successfully");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update stock");
      // Revert stock value on error
      setStockUpdateValues((prev) => ({
        ...prev,
        [variantId]: variant.stock,
      }));
    } finally {
      setUpdatingStock((prev) => ({ ...prev, [variantId]: false }));
    }
  };

  const handleStockInputChange = (variantId, value) => {
    // Ensure non-negative integer
    const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
    setStockUpdateValues((prev) => ({
      ...prev,
      [variantId]: numValue,
    }));
  };

  const getStatusBadge = (variant) => {
    if (!variant.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
          <XCircle className="w-3 h-3" />
          Inactive
        </span>
      );
    }
    if (variant.status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
          <RefreshCw className="w-3 h-3" />
          Pending QC
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    );
  };

  const calculateDiscount = (mrp, sellingPrice) => {
    if (!mrp || !sellingPrice) return 0;
    return (((mrp - sellingPrice) / mrp) * 100).toFixed(1);
  };

  const getFilteredVariants = () => {
    let filtered = [...variants];

    // Apply status filter
    if (filterStatus === "active") {
      filtered = filtered.filter((v) => v.isActive && v.status === "approved");
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((v) => !v.isActive);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((v) => v.status === "pending");
    }

    // Apply sorting
    if (sortBy === "stock") {
      filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    } else if (sortBy === "price") {
      filtered.sort(
        (a, b) =>
          (b.pricing?.sellingPrice || 0) - (a.pricing?.sellingPrice || 0),
      );
    } else if (sortBy === "discount") {
      filtered.sort((a, b) => {
        const discountA = calculateDiscount(
          a.pricing?.mrp,
          a.pricing?.sellingPrice,
        );
        const discountB = calculateDiscount(
          b.pricing?.mrp,
          b.pricing?.sellingPrice,
        );
        return discountB - discountA;
      });
    }

    return filtered;
  };

  const filteredVariants = getFilteredVariants();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Product Variants
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {product?.name} • {variants.length} variants found
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filters and Controls */}

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Variants Table */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-2 text-gray-500">Loading variants...</p>
              </div>
            ) : filteredVariants.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No variants found</p>
                {filterStatus !== "all" && (
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Attributes</th>
                    <th className="px-4 py-3 text-right">MRP</th>
                    <th className="px-4 py-3 text-right">Selling Price</th>
                    <th className="px-4 py-3 text-right">Discount</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVariants.map((variant, index) => {
                    const mrp = variant.pricing?.mrp || 0;
                    const sellingPrice = variant.pricing?.sellingPrice || 0;
                    const discount = calculateDiscount(mrp, sellingPrice);
                    const hasStockChanged =
                      stockUpdateValues[variant._id] !== variant.stock;

                    return (
                      <tr
                        key={variant._id}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {variant.variantTitle}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {variant.variantDiscription}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Palette className="w-3 h-3 text-gray-400" />
                              <span className="capitalize text-gray-700">
                                {variant.attributes?.color || variant.color}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Ruler className="w-3 h-3 text-gray-400" />
                              <span className="uppercase text-gray-700">
                                {variant.attributes?.size || variant.size}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-gray-500 line-through text-xs">
                            ₹{mrp}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-medium text-gray-900">
                            ₹{sellingPrice}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {discount}% OFF
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={stockUpdateValues[variant._id] || 0}
                              onChange={(e) =>
                                handleStockInputChange(
                                  variant._id,
                                  e.target.value,
                                )
                              }
                              min="0"
                              step="1"
                              className={`w-20 px-2 py-1 border rounded-lg text-right ${
                                hasStockChanged
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-300"
                              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            {hasStockChanged && (
                              <button
                                onClick={() => handleStockUpdate(variant._id)}
                                disabled={updatingStock[variant._id]}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Update stock"
                              >
                                <Save
                                  className={`w-4 h-4 ${updatingStock[variant._id] ? "animate-spin" : ""}`}
                                />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getStatusBadge(variant)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(variant)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit variant"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(variant)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete variant"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {filteredVariants.length} of {variants.length} variants shown
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedVariant && (
        <UpdateVariantModal
          variant={selectedVariant}
          product={product}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedVariant(null);
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && variantToDelete && (
        <DeleteConfirmationModal
          variant={variantToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setVariantToDelete(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
