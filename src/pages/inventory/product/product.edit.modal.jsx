import { useState, useEffect, useCallback } from "react";
import RichTextEditor from "./RichTextEditor";
import api from "../../../serviceAuth/axios";
import DynamicSpecificationsEdit from "./DynamicEDITSpecifications";

export default function EditProductModal({ product, onClose, onSuccess }) {
  console.log(product);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "pending",
    returnPolicyDays: 7,
    specifications: {},
    productImage: [],
  });

  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (!product) return;

    setForm((prev) => ({
      ...prev,
      name: product.name || "",
      description: product.description || "",
      status: product.status || "pending",
      returnPolicyDays: product.returnPolicyDays || 7,
      specifications: product.specifications || {},
    }));

    if (product.productImage?.length) {
      setPreviews(
        product.productImage.map(
          (img) => `${import.meta.env.VITE_BASE_URL}${img}`,
        ),
      );
    }
  }, [product]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (html) => {
    setForm((prev) => ({ ...prev, description: html }));
  };

  const handleSpecificationsChange = useCallback((specs) => {
    setForm((prev) => ({ ...prev, specifications: specs }));
  }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      productImage: [...prev.productImage, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      productImage: prev.productImage.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("status", form.status);
      formData.append("returnPolicyDays", form.returnPolicyDays);

      formData.append("specifications", JSON.stringify(form.specifications));

      form.productImage.forEach((file) =>
        formData.append("productImage", file),
      );

      const res = await api.put(`/product/products/${product._id}`, formData);

      onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl border border-[#e6dcc7] p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold text-[#5c5042]">
            Edit Product
          </h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            {/* NAME */}
            <div className="col-span-2">
              <label className="text-sm">Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="col-span-2">
              <label className="text-sm">Description *</label>
              <RichTextEditor
                key={product?._id}
                content={form.description}
                onChange={handleDescriptionChange}
              />
            </div>

            {/* IMAGES */}
            <div className="col-span-2">
              <input type="file" multiple onChange={handleImages} />

              <div className="flex gap-3 mt-3 flex-wrap">
                {previews.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="w-20 h-20 rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RETURN POLICY */}
            <div>
              <label className="text-sm">Return Days</label>
              <input
                type="number"
                name="returnPolicyDays"
                value={form.returnPolicyDays}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input"
              >
                <option value="draft">Draft</option>
                <option value="pending">Submit for QC</option>
              </select>
            </div>

            {/* SPECIFICATIONS */}
            <div className="col-span-2">
              <DynamicSpecificationsEdit
                subCategoryId={product.subCategoryId}
                initialSpecs={form.specifications}
                onChange={handleSpecificationsChange}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button type="button" onClick={onClose} className=" cursor-pointer">
              Cancel
            </button>

            <button
              disabled={loading}
              className="btn-primary cursor-pointer"
              type="submit"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
