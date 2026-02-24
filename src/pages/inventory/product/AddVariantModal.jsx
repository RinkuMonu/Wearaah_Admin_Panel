// pages/inventory/product/AddVariantModal.jsx
import { useState } from "react";
import { X } from "lucide-react";

export default function AddVariantModal({ product, onClose, onSubmit }) {
  const [form, setForm] = useState({
    variantTitle: "",
    variantDiscription: "",
    attributes: {
      size: "",
      color: ""
    },
    pricing: {
      mrp: "",
      discountPercent: "",
      taxPercent: 18
    },
    stock: "",
    variantImages: []
  });

  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Size options based on product sizeType
  const sizeOptions = {
    alpha: ['S', 'M', 'L', 'XL', 'XXL'],
    numeric: ['28', '30', '32', '34', '36', '38', '40', '42', '44']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "size" || name === "color") {
      setForm({
        ...form,
        attributes: {
          ...form.attributes,
          [name]: value
        }
      });
    } else if (name === "mrp" || name === "discountPercent" || name === "taxPercent") {
      setForm({
        ...form,
        pricing: {
          ...form.pricing,
          [name]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    setForm({
      ...form,
      variantImages: [...form.variantImages, ...files]
    });
  };

  const removeImage = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedImages = form.variantImages.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    setForm({ ...form, variantImages: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append form fields
      formData.append('variantTitle', form.variantTitle);
      formData.append('variantDiscription', form.variantDiscription);
      formData.append('attributes', JSON.stringify(form.attributes));
      formData.append('pricing', JSON.stringify(form.pricing));
      formData.append('stock', form.stock);
      
      // Append images
      form.variantImages.forEach((file) => {
        formData.append('variantImages', file);
      });

      await onSubmit(formData);
    } catch (error) {
      console.error('Error in variant submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl border border-[#e6dcc7] p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[#e6dcc7] pb-3">
          <h2 className="text-xl font-semibold text-[#5c5042]">
            Add Variant for {product?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-[#927f68] hover:text-[#5c5042] text-2xl transition"
          >
            &times;
          </button>
        </div>

        {/* Product Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Category:</span> {product?.category} | 
            <span className="font-medium ml-2">Brand:</span> {product?.brand} |
            <span className="font-medium ml-2">Size Type:</span> {product?.sizeType === 'alpha' ? 'Alpha (S, M, L)' : 'Numeric (28, 30, 32)'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Variant Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Variant Title *</label>
              <input
                type="text"
                name="variantTitle"
                value={form.variantTitle}
                onChange={handleChange}
                required
                placeholder="e.g., Nike Polo T-Shirt Black M"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Variant Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Variant Description *</label>
              <textarea
                name="variantDiscription"
                value={form.variantDiscription}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe this variant..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Size - Dynamic based on product sizeType */}
            <div>
              <label className="block text-sm font-medium mb-1">Size *</label>
              {product?.sizeType === 'alpha' || product?.sizeType === 'numeric' ? (
                <select
                  name="size"
                  value={form.attributes.size}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="">Select Size</option>
                  {sizeOptions[product.sizeType].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="size"
                  value={form.attributes.size}
                  onChange={handleChange}
                  required
                  placeholder="Enter size"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-1">Color *</label>
              <input
                type="text"
                name="color"
                value={form.attributes.color}
                onChange={handleChange}
                required
                placeholder="e.g., Red, Blue, Black"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* MRP */}
            <div>
              <label className="block text-sm font-medium mb-1">MRP *</label>
              <input
                type="number"
                name="mrp"
                value={form.pricing.mrp}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 1499"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Discount Percent */}
            <div>
              <label className="block text-sm font-medium mb-1">Discount % *</label>
              <input
                type="number"
                name="discountPercent"
                value={form.pricing.discountPercent}
                onChange={handleChange}
                required
                min="0"
                max="100"
                placeholder="e.g., 40"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Tax Percent */}
            <div>
              <label className="block text-sm font-medium mb-1">Tax % *</label>
              <input
                type="number"
                name="taxPercent"
                value={form.pricing.taxPercent}
                onChange={handleChange}
                required
                min="0"
                max="100"
                placeholder="e.g., 18"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g., 25"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Variant Images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Variant Images</label>
              <div className="flex items-center gap-4 bg-white border border-dashed border-gray-300 rounded-xl p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="text-sm"
                />
              </div>
              
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#927f68] text-white hover:bg-[#7b6b57] disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Variant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}