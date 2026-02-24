
// pages/inventory/product/AddProductModal.jsx
import { useState, useEffect, useCallback } from "react";
import RichTextEditor from "./RichTextEditor";
import DynamicSpecifications from "./DynamicSpecifications";
import api from "../../../serviceAuth/axios";

export default function AddProductModal({
  onClose,
  onSubmit
}) {
  const [form, setForm] = useState({
    brandId: "",
    wearTypeId: "",
    categoryId: "",
    subCategoryId: "",
    name: "",
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
  });

  const [brands, setBrands] = useState([]);
  const [wearTypes, setWearTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Individual loading states
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingWearTypes, setLoadingWearTypes] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const brandsRes = await api.get('/brand');
      if (brandsRes.data.success) {
        setBrands(brandsRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoadingBrands(false);
    }
  };

  // Fetch wear types when brand is selected
  useEffect(() => {
    if (form.brandId) {
      fetchWearTypes();
    } else {
      setWearTypes([]);
    }
  }, [form.brandId]);

  const fetchWearTypes = async () => {
    setLoadingWearTypes(true);
    try {
      const wearTypesRes = await api.get('/wear/type');
      if (wearTypesRes.data.success) {
        setWearTypes(wearTypesRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wear types:', error);
    } finally {
      setLoadingWearTypes(false);
    }
  };

  // Fetch categories when wear type is selected
  useEffect(() => {
    if (form.wearTypeId) {
      fetchCategories();
    } else {
      setCategories([]);
      setForm(prev => ({ ...prev, categoryId: "", subCategoryId: "" }));
    }
  }, [form.wearTypeId]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const categoriesRes = await api.get('/category');
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories when category is selected
  useEffect(() => {
    if (form.categoryId) {
      fetchSubCategories();
    } else {
      setSubCategories([]);
      setFilteredSubCategories([]);
      setForm(prev => ({ ...prev, subCategoryId: "" }));
    }
  }, [form.categoryId]);

  const fetchSubCategories = async () => {
    setLoadingSubCategories(true);
    try {
      const subCategoriesRes = await api.get('/subcategory');
      if (subCategoriesRes.data.success) {
        const allSubCategories = subCategoriesRes.data.categories || [];
        setSubCategories(allSubCategories);
        
        // Filter subcategories based on selected category
        const filtered = allSubCategories.filter(
          sc => sc.categoryId?._id === form.categoryId || sc.categoryId === form.categoryId
        );
        setFilteredSubCategories(filtered);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Reset dependent fields when parent changes
    if (name === 'brandId') {
      setForm(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value,
        wearTypeId: "",
        categoryId: "",
        subCategoryId: ""
      }));
    } else if (name === 'wearTypeId') {
      setForm(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value,
        categoryId: "",
        subCategoryId: ""
      }));
    } else if (name === 'categoryId') {
      setForm(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value,
        subCategoryId: ""
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDescriptionChange = (html) => {
    setForm(prev => ({ ...prev, description: html }));
  };

  const handleSpecificationsChange = useCallback((specs) => {
    setForm(prev => ({ ...prev, specifications: specs }));
  }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setForm(prev => ({ ...prev, productImage: [...prev.productImage, ...files] }));
  };

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({ 
      ...prev, 
      productImage: prev.productImage.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Get seller ID from localStorage or context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      formData.append('sellerId', user.id);
      
      // Append all form fields
      Object.keys(form).forEach(key => {
        if (key === 'specifications') {
          if (Object.keys(form[key]).length > 0) {
            formData.append(key, JSON.stringify(form[key]));
          }
        } else if (key === 'productImage') {
          form.productImage.forEach((file) => {
            formData.append('productImage', file);
          });
        } else if (key !== 'productImage') {
          if (form[key] !== '' && form[key] !== undefined && form[key] !== null) {
            formData.append(key, form[key]);
          }
        }
      });

      // Call the onSubmit prop with formData
      await onSubmit(formData);
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
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
                {loadingBrands ? (
                  <option value="" disabled>Loading brands...</option>
                ) : (
                  brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))
                )}
              </select>
            </div>

            {/* Wear Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Wear Type *</label>
              <select 
                name="wearTypeId" 
                value={form.wearTypeId} 
                onChange={handleChange} 
                required
                disabled={!form.brandId || loadingWearTypes}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-100"
              >
                <option value="">Select Wear Type</option>
                {loadingWearTypes ? (
                  <option value="" disabled>Loading wear types...</option>
                ) : (
                  wearTypes.map((type) => (
                    <option key={type._id} value={type._id}>{type.name}</option>
                  ))
                )}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select 
                name="categoryId" 
                value={form.categoryId} 
                onChange={handleChange} 
                required
                disabled={!form.wearTypeId || loadingCategories}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-100"
              >
                <option value="">Select Category</option>
                {loadingCategories ? (
                  <option value="" disabled>Loading categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))
                )}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Sub Category *</label>
              <select 
                name="subCategoryId" 
                value={form.subCategoryId} 
                onChange={handleChange} 
                required
                disabled={!form.categoryId || loadingSubCategories || filteredSubCategories.length === 0}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-100"
              >
                <option value="">Select Sub Category</option>
                {loadingSubCategories ? (
                  <option value="" disabled>Loading subcategories...</option>
                ) : (
                  filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))
                )}
              </select>
            </div>

            {/* Product Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Product Name *</label>
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
              <label className="block text-sm font-medium mb-1">Description *</label>
              <RichTextEditor
                content={form.description}
                onChange={handleDescriptionChange}
                placeholder="Write detailed product description..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.description?.replace(/<[^>]*>/g, '').length || 0} characters
              </p>
            </div>

            {/* Product Images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Product Images *</label>
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
              <label className="block text-sm font-medium mb-1">Return Policy (Days) *</label>
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
            <div className="col-span-2 mt-4">
              <DynamicSpecifications
                subCategoryId={form.subCategoryId}
                onChange={handleSpecificationsChange}
                initialSpecs={form.specifications}
              />
            </div>
          </div>

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
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}