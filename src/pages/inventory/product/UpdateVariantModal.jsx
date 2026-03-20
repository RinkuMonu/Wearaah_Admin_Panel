// pages/inventory/product/UpdateVariantModal.jsx
import { useState } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  DollarSign,
  Package,
  Tag,
  Palette,
  Ruler,
  FileText,
  AlertCircle,
} from "lucide-react";
import { COLOR_OPTIONS, SIZE_MAP } from "../../../Config/sizeNDcolor";
import api from "../../../serviceAuth/axios";

export default function UpdateVariantModal({
  variant,
  product,
  onClose,
  onSuccess,
}) {
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  // Get size options based on product configuration
  const sizeOptions =
    product?.sizeType === "numeric"
      ? ["28", "30", "32", "34", "36", "38", "40"]
      : product?.sizeType === "free"
        ? ["Free Size"]
        : SIZE_MAP[product?.gender] || [];

  const taxPercent = product?.taxPercent || 0;

  const [form, setForm] = useState({
    variantTitle: variant.variantTitle || "",
    variantDiscription: variant.variantDiscription || "",
    size: variant.size || variant.attributes?.size || "",
    color: variant.color || variant.attributes?.color || "",
    pricing: {
      costPrice: variant.pricing?.costPrice || "",
      mrp: variant.pricing?.mrp || "",
      sellingPrice: variant.pricing?.sellingPrice || "",
    },
    stock: variant.stock || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  /* ---------------- PRICE CALCULATOR ---------------- */

  const sellingPrice = Number(form.pricing.sellingPrice || 0);
  const costPrice = Number(form.pricing.costPrice || 0);
  const mrp = Number(form.pricing.mrp || 0);

  const taxableAmount =
    sellingPrice > 0 ? sellingPrice / (1 + taxPercent / 100) : 0;
  const gstAmount = sellingPrice - taxableAmount;

  const platformFeePercent = 0;
  const paymentFeePercent = 0;

  const platformFee = (sellingPrice * platformFeePercent) / 100;
  const paymentFee = (sellingPrice * paymentFeePercent) / 100;
  const sellerEarning = sellingPrice - platformFee - paymentFee;
  const profit = sellerEarning - costPrice;
  const discountPercent =
    mrp > 0 ? (((mrp - sellingPrice) / mrp) * 100).toFixed(1) : 0;

  // Validation checks
  const isValidPrice = sellingPrice <= mrp || mrp === 0;
  const isProfitable = profit >= 0;

  /* ---------------- FORM CHANGE ---------------- */

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;

    if (name === "size" || name === "color") {
      setForm({
        ...form,
        [name]: value,
      });
    } else if (
      name === "mrp" ||
      name === "costPrice" ||
      name === "sellingPrice"
    ) {
      const numValue = value === "" ? "" : Math.max(0, Number(value));
      setForm({
        ...form,
        pricing: {
          ...form.pricing,
          [name]: numValue,
        },
      });
    } else if (name === "stock") {
      const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
      setForm({ ...form, [name]: numValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug logs
    console.log("Form Data:", form);
    console.log("Size Options:", sizeOptions);
    console.log("Selected Size:", form.size);

    // Validate required fields
    if (
      !form.variantTitle ||
      !form.variantDiscription ||
      !form.size ||
      !form.color
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate price logic
    if (sellingPrice > mrp && mrp > 0) {
      setError("Selling price cannot be greater than MRP");
      return;
    }

    if (costPrice > mrp && mrp > 0) {
      setError("Cost price cannot be greater than MRP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.put(`/variant/admin/variants/${variant._id}`, {
        variantTitle: form.variantTitle,
        variantDiscription: form.variantDiscription,
        size: form.size,
        color: form.color,
        pricing: {
          costPrice: Number(form.pricing.costPrice) || 0,
          mrp: Number(form.pricing.mrp) || 0,
          sellingPrice: Number(form.pricing.sellingPrice) || 0,
          taxPercent,
        },
        stock: Number(form.stock) || 0,
      });

      if (response.data.success) {
        onSuccess(response.data.variant);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update variant");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Update Variant</h2>
            <p className="text-sm text-gray-500 mt-1">
              {product?.name} • {product?.gender} • {product?.sizeType} size
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    Variant Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="variantTitle"
                    value={form.variantTitle}
                    onChange={handleChange}
                    onBlur={() => handleBlur("title")}
                    required
                    placeholder="e.g., Cotton Blue Shirt"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="variantDiscription"
                    value={form.variantDiscription}
                    onChange={handleChange}
                    onBlur={() => handleBlur("description")}
                    required
                    rows="3"
                    placeholder="Describe the variant details..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* Size and Color Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Size Field with Dropdown */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Ruler className="w-4 h-4" />
                      Size <span className="text-red-500">*</span>
                    </label>

                    {/* Show dropdown for size selection */}
                    <select
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      onBlur={() => handleBlur("size")}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                    >
                      <option value="">Select Size</option>
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>

                    {/* Display current size type */}
                    <p className="text-xs text-gray-500 mt-1">
                      Size type:{" "}
                      {product?.sizeType === "numeric"
                        ? "Numeric"
                        : product?.sizeType === "free"
                          ? "Free Size"
                          : "Standard"}
                      {product?.gender && ` • ${product.gender}`}
                    </p>
                  </div>

                  {/* Color Field */}
                  <div className="space-y-2 relative">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Palette className="w-4 h-4" />
                      Color <span className="text-red-500">*</span>
                    </label>

                    {/* Selected Color */}
                    <div
                      onClick={() => setShowColorDropdown(!showColorDropdown)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 cursor-pointer flex items-center justify-between"
                    >
                      {form.color ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border"
                            style={{
                              background:
                                COLOR_OPTIONS.find((c) => c.name === form.color)
                                  ?.hex || "#ccc",
                            }}
                          ></span>
                          {form.color}
                        </div>
                      ) : (
                        <span className="text-gray-400">Select Color</span>
                      )}
                    </div>

                    {/* Dropdown */}
                    {showColorDropdown && (
                      <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                        {COLOR_OPTIONS.map((color) => (
                          <div
                            key={color.name}
                            onClick={() => {
                              setForm({ ...form, color: color.name });
                              setShowColorDropdown(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <span
                              className="w-4 h-4 rounded-full border"
                              style={{ background: color.hex }}
                            ></span>

                            <span>{color.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Fields */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      Cost Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="costPrice"
                        value={form.pricing.costPrice}
                        onChange={handleChange}
                        onBlur={() => handleBlur("costPrice")}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Tag className="w-4 h-4" />
                      MRP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="mrp"
                        value={form.pricing.mrp}
                        onChange={handleChange}
                        onBlur={() => handleBlur("mrp")}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      Selling Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="sellingPrice"
                        value={form.pricing.sellingPrice}
                        onChange={handleChange}
                        onBlur={() => handleBlur("sellingPrice")}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={`w-full border rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 transition ${
                          touched.sellingPrice && !isValidPrice && mrp > 0
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {touched.sellingPrice && !isValidPrice && mrp > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Selling price should be less than MRP
                      </p>
                    )}
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Package className="w-4 h-4" />
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    onBlur={() => handleBlur("stock")}
                    required
                    min="0"
                    step="1"
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Variant"
                  )}
                </button>
              </form>
            </div>

            {/* Calculator */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Price Breakdown
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Selling Price</span>
                    <span className="font-medium">
                      ₹{sellingPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST ({taxPercent}%)</span>
                    <span className="font-medium text-orange-600">
                      ₹{gstAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee (10%)</span>
                    <span className="font-medium text-red-500">
                      -₹{platformFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Fee (2%)</span>
                    <span className="font-medium text-red-500">
                      -₹{paymentFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-700">Your Earnings</span>
                      <span className="text-blue-600">
                        ₹{sellerEarning.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">Cost Price</span>
                    <span className="text-gray-900">
                      ₹{costPrice.toFixed(2)}
                    </span>
                  </div>

                  <div
                    className={`flex justify-between font-bold text-lg pt-2 border-t border-gray-200 ${
                      profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span>Estimated Profit</span>
                    <span>₹{profit.toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm bg-green-50 p-2 rounded-lg">
                      <span className="text-green-700">Discount Offered</span>
                      <span className="font-semibold text-green-700">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  )}

                  {/* Profit Margin Indicator */}
                  {sellingPrice > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Profit Margin</span>
                        <span>
                          {((profit / sellingPrice) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            profit >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(0, (profit / sellingPrice) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Tips */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
                    Pricing Tips
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>
                      • Keep selling price lower than MRP for better conversion
                    </li>
                    <li>• Aim for at least 20% profit margin</li>
                    <li>• Higher stock = better visibility in searches</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
