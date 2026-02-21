import { useState } from "react";

export default function AddProductModal({
  onClose,
  onSubmit,
  brands = [],
  categories = [],
  subCategories = [],
}) {
  const [form, setForm] = useState({
    brand: "",
    category: "",
    subCategory: "",
    name: "",
    description: "",
    sizeType: "alpha",
    sizeValue: "",
    status: "active",
    fabric: "",
    fit: "",
    returnPolicy: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl border border-[#e6dcc7] p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#e6dcc7] pb-4">
          <h2 className="text-2xl font-semibold text-[#5c5042]">
            Create Product
          </h2>
          <button
            onClick={onClose}
            className="text-[#927f68] hover:text-[#5c5042] text-2xl transition"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">

          {/* Brand */}
          <div>
            <label className="label-style">Brand *</label>
            <select name="brand" value={form.brand} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400">
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="label-style">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400">
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sub Category */}
          <div>
            <label className="label-style">Sub Category *</label>
            <select name="subCategory" value={form.subCategory} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400">
              <option value="">Select Sub Category</option>
              {subCategories.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="label-style">Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="label-style">Description (20–200 words) *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write detailed product description..."
              className="input-style resize-none"
            />
          </div>

          {/* Product Image */}
          <div className="col-span-2">
            <label className="label-style">Product Image *</label>
            <div className="flex items-center gap-4 bg-white border border-dashed border-[#cbbca5] rounded-xl p-4">
              <input type="file" accept="image/*" onChange={handleImage} />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-md border border-[#d6cbb5]"
                />
              )}
            </div>
          </div>

          {/* Size Type */}
          <div>
            <label className="label-style">Size Type *</label>
            <select name="sizeType" value={form.sizeType} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400">
              <option value="alpha">Alpha (S, M, L)</option>
              <option value="numeric">Numeric (28, 30, 32)</option>
            </select>
          </div>

          {/* Size Value */}
          <div>
            <label className="label-style">Size *</label>
            <input
              name="sizeValue"
              value={form.sizeValue}
              onChange={handleChange}
              placeholder="Enter size"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>

          {/* Fabric */}
          <div>
            <label className="label-style">Fabric *</label>
            <input
              name="fabric"
              value={form.fabric}
              onChange={handleChange}
              placeholder="e.g. Cotton, Polyester"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>

          {/* Fit */}
          <div>
            <label className="label-style">Fit *</label>
            <select name="fit" value={form.fit} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400">
              <option value="">Select Fit</option>
              <option>Slim</option>
              <option>Regular</option>
              <option>Loose</option>
              <option>Oversized</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="label-style">Status *</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm 
focus:outline-none focus:ring-0 focus:border-gray-400">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Return Policy */}
          <div className="col-span-2">
            <label className="label-style">Return Policy *</label>
            <textarea
              name="returnPolicy"
              value={form.returnPolicy}
              onChange={handleChange}
              rows="3"
              placeholder="Mention return & refund policy..."
              className="input-style resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#e6dcc7]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-[#927f68] text-[#927f68] hover:bg-[#927f68] hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="px-6 py-2 rounded-md bg-[#927f68] text-white hover:bg-[#7b6b57] transition"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
}