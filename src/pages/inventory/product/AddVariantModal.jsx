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
} from "lucide-react";
import { COLOR_OPTIONS, SIZE_MAP } from "../../../Config/sizeNDcolor";

export default function AddVariantModal({ product, onClose, onSubmit }) {
  console.log(product);
  const sizeOptions =
    product?.sizeType === "numeric"
      ? ["28", "30", "32", "34", "36", "38", "40"]
      : product?.sizeType === "free"
        ? ["Free Size"]
        : SIZE_MAP[product?.gender] || [];

  const taxPercent = product?.taxPercent || 0;

  const [form, setForm] = useState({
    variantTitle: "",
    variantDiscription: "",
    color: "",
    sizes: [
      {
        size: "",
        stock: "",
        pricing: {
          costPrice: "",
          mrp: "",
          sellingPrice: "",
        },
      },
    ],
    variantImages: [],
  });

  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  /* ---------------- PRICE CALCULATOR ---------------- */

  const firstSize = form.sizes[0] || {};
  const sellingPrice = Number(firstSize?.pricing?.sellingPrice || 0);
  const costPrice = Number(firstSize?.pricing?.costPrice || 0);
  const mrp = Number(firstSize?.pricing?.mrp || 0);

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
      // Ensure positive numbers
      const numValue = value === "" ? "" : Math.max(0, Number(value));
      setForm({
        ...form,
        pricing: {
          ...form.pricing,
          [name]: numValue,
        },
      });
    } else if (name === "stock") {
      // Ensure non-negative integer for stock
      const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
      setForm({ ...form, [name]: numValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  /* ---------------- IMAGES ---------------- */

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and size
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isValidType) setError("Only image files are allowed");
      if (!isValidSize) setError("File size should be less than 5MB");
      return isValidType && isValidSize;
    });

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setPreviews([...previews, ...newPreviews]);
    setForm({
      ...form,
      variantImages: [...form.variantImages, ...validFiles],
    });
  };

  const removeImage = (index) => {
    // Clean up object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);

    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedImages = form.variantImages.filter((_, i) => i !== index);

    setPreviews(updatedPreviews);
    setForm({ ...form, variantImages: updatedImages });
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    console.log(form.variantTitle);
    console.log(form.variantDiscription);
    console.log(form.size);
    console.log(form.color);
    console.log(form.stock);
    console.log(form.variantImages.length);

    // Validate required fields
    if (
      !form.variantTitle ||
      !form.variantDiscription ||
      !form.color ||
      form.variantImages.length === 0
    ) {
      setError("Please fill in all required fields and add at least 3 image");
      return;
    }
    if (!form.sizes.length || !form.sizes[0].size) {
      setError("Please add at least one size");
      return;
    }

    // Validate price logic
    if (sellingPrice > mrp && mrp > 0) {
      setError("Selling price cannot be greater than MRP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("variantTitle", form.variantTitle);
      formData.append("variantDiscription", form.variantDiscription);
      formData.append("sizes", JSON.stringify(form.sizes));
      formData.append("color", form.color);

      // formData.append(
      //   "pricing",
      //   JSON.stringify({
      //     costPrice: Number(form.pricing.costPrice) || 0,
      //     mrp: Number(form.pricing.mrp) || 0,
      //     sellingPrice: Number(form.pricing.sellingPrice) || 0,
      //     taxPercent,
      //   }),
      // );

      // formData.append("stock", form.stock);

      form.variantImages.forEach((file) => {
        formData.append("variantImages", file);
      });

      await onSubmit(formData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add variant");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200">
        {/* HEADER */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Variant
            </h2>
            <p className="text-sm text-gray-500 mt-1">for {product?.name}</p>
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
            {/* ================= FORM ================= */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
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

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    Variant Description <span className="text-red-500">*</span>
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
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Palette className="w-4 h-4" />
                      Color <span className="text-red-500">*</span>
                    </label>

                    <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                      {COLOR_OPTIONS.map((color) => (
                        <div
                          key={color.name}
                          onClick={() =>
                            setForm({ ...form, color: color.name })
                          }
                          className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 
        ${form.color === color.name ? "bg-blue-100" : ""}`}
                        >
                          {/* LEFT COLOR DOT */}
                          <div className="flex items-center gap-3">
                            <span
                              className="w-4 h-4 rounded-full border"
                              style={{ background: color.hex }}
                            ></span>

                            {/* COLOR NAME */}
                            <span>{color.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Sizes + Pricing + Stock
                  </label>

                  {form.sizes.map((item, index) => (
                    <div
                      key={index}
                      className="border p-3 rounded-lg space-y-2 grid grid-cols-3 gap-3"
                    >
                      {/* SIZE */}
                      <select
                        value={item.size}
                        className="border border-gray-300 rounded-lg px-4 py-2.5"
                        onChange={(e) => {
                          const updated = [...form.sizes];
                          updated[index].size = e.target.value;
                          setForm({ ...form, sizes: updated });
                        }}
                        required
                      >
                        <option value="">Select Size</option>
                        {sizeOptions.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>

                      {/* COST */}
                      <input
                        className="border p-3 rounded-lg space-y-2"
                        placeholder="Cost Price"
                        value={item.pricing.costPrice}
                        onChange={(e) => {
                          const updated = [...form.sizes];
                          updated[index].pricing.costPrice = e.target.value;
                          setForm({ ...form, sizes: updated });
                        }}
                        required
                      />
                      {/* MRP */}
                      <input
                        placeholder="MRP"
                        className="border p-3 rounded-lg space-y-2"
                        value={item.pricing.mrp}
                        onChange={(e) => {
                          const updated = [...form.sizes];
                          updated[index].pricing.mrp = e.target.value;
                          setForm({ ...form, sizes: updated });
                        }}
                        required
                      />

                      {/* SELLING */}
                      <input
                        placeholder="Selling Price"
                        className="border p-3 rounded-lg space-y-2"
                        value={item.pricing.sellingPrice}
                        onChange={(e) => {
                          const updated = [...form.sizes];
                          updated[index].pricing.sellingPrice = e.target.value;
                          setForm({ ...form, sizes: updated });
                        }}
                        required
                      />

                      {/* STOCK */}
                      <input
                        type="number"
                        placeholder="Stock"
                        className="border p-3 rounded-lg space-y-2"
                        value={item.stock}
                        onChange={(e) => {
                          const updated = [...form.sizes];
                          updated[index].stock = e.target.value;
                          setForm({ ...form, sizes: updated });
                        }}
                        required
                      />

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.sizes.filter(
                            (_, i) => i !== index,
                          );
                          setForm({ ...form, sizes: updated });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* ADD BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        sizes: [
                          ...form.sizes,
                          {
                            size: "",
                            stock: "",
                            pricing: {
                              costPrice: "",
                              mrp: "",
                              sellingPrice: "",
                            },
                          },
                        ],
                      })
                    }
                  >
                    + Add Size
                  </button>
                </div>

                {/* Price Fields */}
                {/* <div className="grid grid-cols-3 gap-4">
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
                        placeholder="0.00"
                        min="0"
                        step="0.01"
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
                        placeholder="0.00"
                        min="0"
                        step="0.01"
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
                        placeholder="0.00"
                        min="0"
                        step="0.01"
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
                </div> */}

                {/* Stock Field */}
                {/* <div className="space-y-2">
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
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div> */}

                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ImageIcon className="w-4 h-4" />
                    Variant Images <span className="text-red-500">*</span>
                  </label>

                  {/* Image Preview Grid */}
                  {previews.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {previews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImages}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
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
                      Adding Variant...
                    </span>
                  ) : (
                    "Add Variant"
                  )}
                </button>
              </form>
            </div>

            {/* ================= CALCULATOR ================= */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Price Breakdown
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Selling Price <span>(Incl.Tax)</span>
                    </span>
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
                    <span className="text-gray-600">Platform Fee (0%)</span>
                    <span className="font-medium text-red-500">
                      -₹{platformFee.toFixed(2)}
                    </span>
                  </div>

                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Fee (2%)</span>
                    <span className="font-medium text-red-500">
                      -₹{paymentFee.toFixed(2)}
                    </span>
                  </div> */}

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
