// pages/qc/VariantQCModal.jsx
import { useState, useEffect } from "react";
import {
  X,
  Package,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  DollarSign,
  Ruler,
  Palette,
  Shield,
  FileText,
  Loader2,
  Store,
  Tag,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import { useAuth } from "../../serviceAuth/context";

export default function VariantQCModal({
  productId,
  productName,
  onClose,
  onSuccess,
  productSpecifications,
}) {
  // console.log("Product Specifications:", productSpecifications);
  const { user } = useAuth;
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch variants for this product
  const fetchVariants = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/variant/admin/qc-variants/${productId}`);

      if (res.data.success) {
        setVariants(res.data.variants || []);
        if (res.data.variants?.length > 0 && !selectedVariant) {
          setSelectedVariant(res.data.variants[0]);
        }
      } else {
        setError(res.data.message || "Failed to fetch variants");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch variants");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchVariants();
    }
  }, [productId]);

  // Handle Approve
  const handleApprove = async (variant) => {
    const result = await Swal.fire({
      title: "Approve Variant?",
      html: `
        <div class="text-left">
          <p class="mb-2">Are you sure you want to approve:</p>
          <p class="font-semibold text-blue-600">${variant.variantTitle}</p>
          <p class="text-sm text-gray-500 mt-1">SKU: ${variant.sku}</p>
          <p class="text-sm text-gray-500">Size: ${variant.size} | Color: ${variant.color}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setSubmitting(true);
      try {
        const res = await api.put(
          `/variant/admin/variant/${variant._id}/status`,
          {
            status: "approved",
            qcNote: "",
          },
        );

        if (res.data.success) {
          Swal.fire({
            title: "Approved!",
            text: "Variant has been approved and is now live.",
            icon: "success",
            confirmButtonColor: "#10b981",
          });
          fetchVariants(); // Refresh the list
          if (onSuccess) onSuccess();
          onClose();
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || "Failed to approve variant",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Handle Reject with note
  const handleReject = async (variant) => {
    const { value: rejectionNote } = await Swal.fire({
      title: "Reject Variant",
      html: `
        <div class="text-left">
          <p class="mb-3">Please provide a reason for rejecting:</p>
          <p class="font-semibold text-red-600">${variant.variantTitle}</p>
          <p class="text-sm text-gray-500 mt-1">SKU: ${variant.sku}</p>
          <p class="text-sm text-gray-500">Size: ${variant.size} | Color: ${variant.color}</p>
          <textarea id="rejectionReason" class="swal2-textarea mt-3" placeholder="Enter rejection reason..." rows="4"></textarea>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const reason = document.getElementById("rejectionReason").value;
        if (!reason || !reason.trim()) {
          Swal.showValidationMessage("Rejection reason is required");
          return false;
        }
        return reason;
      },
    });

    if (rejectionNote) {
      setSubmitting(true);
      try {
        const res = await api.put(
          `/variant/admin/variant/${variant._id}/status`,
          {
            status: "rejected",
            qcNote: rejectionNote,
          },
        );

        if (res.data.success) {
          Swal.fire({
            title: "Rejected!",
            text: "Variant has been rejected successfully.",
            icon: "warning",
            confirmButtonColor: "#ef4444",
          });
          fetchVariants(); // Refresh the list
          if (onSuccess) onSuccess();
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || "Failed to reject variant",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getStatusBadge = (status, isActive) => {
    if (!isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const nextImage = () => {
    if (selectedVariant?.variantImages?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % selectedVariant.variantImages.length,
      );
    }
  };

  const prevImage = () => {
    if (selectedVariant?.variantImages?.length > 0) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedVariant.variantImages.length) %
          selectedVariant.variantImages.length,
      );
    }
  };

  const filteredVariants = variants.filter((variant) => {
    const matchesSearch =
      variant.variantTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || variant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = variants.filter(
    (v) => v.status === "pending" && v.isActive,
  ).length;
  const approvedCount = variants.filter((v) => v.status === "approved").length;
  const rejectedCount = variants.filter((v) => v.status === "rejected").length;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading variants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Error</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Variant Quality Check
            </h2>
            <p className="text-sm text-gray-500">
              {productName} • {variants.length} variant(s) • {pendingCount}{" "}
              pending review
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "list"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Variant List ({filteredVariants.length})
            </button>
            {selectedVariant && (
              <button
                onClick={() => setActiveTab("detail")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "detail"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Review Details
              </button>
            )}
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          {activeTab === "list" ? (
            // Variant List View
            <div className="p-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by title or SKU..."
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status ({variants.length})</option>
                  <option value="pending">Pending ({pendingCount})</option>
                  <option value="approved">Approved ({approvedCount})</option>
                  <option value="rejected">Rejected ({rejectedCount})</option>
                </select>
              </div>

              {/* Variants Grid */}
              {filteredVariants.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No variants found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVariants.map((variant) => (
                    <div
                      key={variant._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedVariant?._id === variant._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setCurrentImageIndex(0);
                        setActiveTab("detail");
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 line-clamp-2">
                            {variant.variantTitle}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {variant.sku}
                          </p>
                        </div>
                        {getStatusBadge(variant.status, variant.isActive)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Palette className="w-3 h-3" />
                        <span className="capitalize">{variant.color}</span>
                        <Ruler className="w-3 h-3 ml-2" />
                        <span>{variant.size}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Selling Price</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(variant.pricing?.sellingPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p
                            className={`font-medium ${
                              variant.stock === 0
                                ? "text-red-600"
                                : variant.stock <= 5
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {variant.stock} units
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Variant Detail View
            selectedVariant && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Images */}
                  <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                      {selectedVariant.variantImages?.length > 0 ? (
                        <>
                          <img
                            src={
                              baseUrl +
                              selectedVariant.variantImages[currentImageIndex]
                            }
                            alt={selectedVariant.variantTitle}
                            className="w-full h-full object-contain"
                          />
                          {selectedVariant.variantImages.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                              >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                              >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {selectedVariant.variantImages?.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedVariant.variantImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                              idx === currentImageIndex
                                ? "border-blue-500"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={baseUrl + img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    {/* Variant Info */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {selectedVariant.variantTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        SKU: {selectedVariant.sku}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(
                          selectedVariant.status,
                          selectedVariant.isActive,
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedVariant.variantDiscription}
                      </p>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Ruler className="w-4 h-4" />
                          <span className="text-xs font-medium">Size</span>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {selectedVariant.size}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Palette className="w-4 h-4" />
                          <span className="text-xs font-medium">Color</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: selectedVariant.color }}
                          />
                          <p className="font-semibold text-gray-800 capitalize">
                            {selectedVariant.color}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Product Specifications */}
                    {productSpecifications &&
                      Object.keys(productSpecifications).length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-600" />
                            Product Specifications
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(productSpecifications).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0"
                                >
                                  <span className="text-gray-700 capitalize font-medium text-sm">
                                    {key.replace(/([A-Z])/g, " $1").trim()}:
                                  </span>
                                  <span className="text-gray-600 text-sm ml-2 text-right">
                                    {typeof value === "boolean"
                                      ? value
                                        ? "Yes"
                                        : "No"
                                      : value || "N/A"}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* Pricing */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Pricing Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cost Price:</span>
                          <span className="font-medium">
                            {formatCurrency(selectedVariant.pricing?.costPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">MRP:</span>
                          <span className="font-medium line-through text-gray-500">
                            {formatCurrency(selectedVariant.pricing?.mrp)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Selling Price:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(
                              selectedVariant.pricing?.sellingPrice,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock:</span>
                          <span
                            className={`font-medium ${
                              selectedVariant.stock === 0
                                ? "text-red-600"
                                : selectedVariant.stock <= 5
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {selectedVariant.stock} units
                          </span>
                        </div>
                        {/* <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Returnable:</span>
                          <span className="font-medium">
                            {selectedVariant.returnable ? "Yes" : "No"}
                          </span>
                        </div> */}
                      </div>
                    </div>

                    {/* QC Checklist */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-13">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        QC Checklist
                      </h4>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>
                            Images are clear and show the actual product
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Title and description are accurate</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Size and color specifications are correct</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Pricing is appropriate and logical</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer Actions */}
        {user?.user?.role !== "seller" &&
          activeTab === "detail" &&
          selectedVariant &&
          selectedVariant.status === "pending" &&
          selectedVariant.isActive && (
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setActiveTab("list")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to List
              </button>
              <button
                onClick={() => handleReject(selectedVariant)}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedVariant)}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            </div>
          )}

        {activeTab === "list" && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
