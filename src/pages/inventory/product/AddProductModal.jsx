// pages/inventory/product/AddProductModal.jsx
import { useState, useEffect, useCallback } from "react";
import RichTextEditor from "./RichTextEditor";
import DynamicSpecifications from "./DynamicSpecifications";
import api from "../../../serviceAuth/axios";

export default function AddProductModal({ onClose, onSubmit, brand }) {
  const [form, setForm] = useState({
    brandId: "",
    subCategoryId: "",
    gender: "",
    name: "",
    hsnCode: "",
    description: "",
    sizeType: "alpha",
    status: "pending",
    specifications: {},
    returnPolicyDays: 7,
    isNewArrival: true,
    isTrending: false,
    isBestSelling: false,
    isTopRated: false,
    productImage: [],
    keywords: "",
  });

  const [brands, setBrands] = useState(brand || []);
  const [categories, setCategories] = useState([]);
  console.log(categories);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Individual loading states
  const [errorr, seterrorr] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Fetch categories when wear type is selected
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const categoriesRes = await api.get("/category");
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories when category is selected
  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    setLoadingSubCategories(true);
    try {
      const subCategoriesRes = await api.get("/subcategory");
      if (subCategoriesRes.data.success) {
        const allSubCategories = subCategoriesRes?.data?.categories || [];
        setFilteredSubCategories(allSubCategories);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Reset dependent fields when parent changes
    if (name === "brandId") {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        wearTypeId: "",
        categoryId: "",
        subCategoryId: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleDescriptionChange = (html) => {
    setForm((prev) => ({ ...prev, description: html }));
  };

  const handleSpecificationsChange = useCallback((specs) => {
    setForm((prev) => ({ ...prev, specifications: specs }));
  }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setForm((prev) => ({
      ...prev,
      productImage: [...prev.productImage, ...files],
    }));
  };

  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      productImage: prev.productImage.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    seterrorr("");

    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // // Get seller ID from localStorage or context
      // const user = JSON.parse(localStorage.getItem("user") || "{}");
      // formData.append("sellerId", user.id);

      // Append all form fields
      Object.keys(form).forEach((key) => {
        if (key === "specifications") {
          if (Object.keys(form[key]).length > 0) {
            formData.append(key, JSON.stringify(form[key]));
          }
        } else if (key === "productImage") {
          form.productImage.forEach((file) => {
            formData.append("productImage", file);
          });
        } else if (key !== "productImage") {
          if (
            form[key] !== "" &&
            form[key] !== undefined &&
            form[key] !== null
          ) {
            formData.append(key, form[key]);
          }
        }
      });

      // Call the onSubmit prop with formData
      await onSubmit(formData);
    } catch (error) {
      seterrorr(
        error.response?.data?.message ||
          "An error occurred while creating the product.",
      );
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl border border-[#e6dcc7] p-8">
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            {/* Brand */}
            <div>
              <label className="block text-sm font-medium mb-1">Brand *</label>
              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400"
              >
                <option value="">Select Brand</option>
                {brands.length === 0 ? (
                  <option value="" disabled>
                    No brands available
                  </option>
                ) : (
                  brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {/* Sub Category */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Sub Category *
              </label>
              <select
                name="subCategoryId"
                value={form.subCategoryId}
                onChange={handleChange}
                required
                disabled={filteredSubCategories.length === 0}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-100"
              >
                <option value="">Select Sub Category</option>
                {loadingSubCategories ? (
                  <option value="" disabled>
                    Loading subcategories...
                  </option>
                ) : (
                  filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {/* gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            {/* hsn */}
            <div>
              <label className="block text-sm font-medium mb-1">
                HSN Code *
              </label>

              <input
                type="text"
                name="hsnCode"
                value={form.hsnCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setForm((prev) => ({ ...prev, hsnCode: value }));
                }}
                maxLength={8}
                required
                placeholder="Enter HSN Code (eg. 6205)"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400"
              />
            </div>

            {/* Product Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Product Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <RichTextEditor
                content={form.description}
                onChange={handleDescriptionChange}
                placeholder="Write detailed product description..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.description?.replace(/<[^>]*>/g, "").length || 0}{" "}
                characters
              </p>
            </div>
            {/* keyword */}
            {/* Keywords */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Keywords (Search Tags)
              </label>

              <input
                type="text"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="e.g. black tshirt, oversized tshirt, cotton tshirt"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
              />

              {/* 🔥 Seller Guide */}
              <p className="text-xs text-gray-500 mt-1">
                Add comma separated keywords that customers might search. (high sale chance's) <br />
                Example: <b>shirt for men, black tshirt, oversized tshirt, cotton tshirt</b>
              </p>
            </div>

            {/* Product Images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Product Images *
              </label>
              <div className="flex items-center gap-4 bg-white border border-dashed border-gray-300 rounded-xl p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="text-sm"
                  required={previews.length === 0}
                />
              </div>

              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Return Policy Days */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Return Policy (Days) *
              </label>
              <input
                type="number"
                name="returnPolicyDays"
                value={form.returnPolicyDays}
                onChange={handleChange}
                required
                min="0"
                max="30"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400"
              >
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Product Flags */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={form.isNewArrival}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">New Arrival</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={form.isTrending}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Trending</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isBestSelling"
                  checked={form.isBestSelling}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Best Selling</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isTopRated"
                  checked={form.isTopRated}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Top Rated</span>
              </label>
            </div>

            {/* Specifications */}
            <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
              <DynamicSpecifications
                subCategoryId={form.subCategoryId}
                onChange={handleSpecificationsChange}
                initialSpecs={form.specifications}
              />
            </div>
          </div>
          {errorr && <p className="text-red-500 text-sm mt-4">{errorr}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#e6dcc7]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-[#927f68] text-[#927f68] hover:bg-[#927f68] hover:text-white transition"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-[#927f68] text-white hover:bg-[#7b6b57] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
