import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../serviceAuth/axios";

export default function CategoryModal({ onClose, refresh, editData }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [name, setName] = useState(editData?.name || "");
  const [displayOrder, setDisplayOrder] = useState(editData?.displayOrder || 0);
  const [showOnHome, setShowOnHome] = useState(editData?.showOnHome || false);
  const [isActive, setIsActive] = useState(editData?.isActive ?? true);
  const [description, setDescription] = useState(editData?.description || "");

  const [smallimage, setSmallimage] = useState(null);
  const [bannerimage, setBannerimage] = useState(null);
  const [smallImagePreview, setSmallImagePreview] = useState(
    editData?.smallimage || null,
    ``,
  );
  const [bannerImagePreview, setBannerImagePreview] = useState(
    editData?.bannerimage || null,
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDisplayOrder(editData.displayOrder || 0);
      setShowOnHome(editData.showOnHome || false);
      setIsActive(editData.isActive ?? true);
      setDescription(editData.description || "");
      setSmallImagePreview(
        editData.smallimage
          ? `${import.meta.env.VITE_BASE_URL}${editData.smallimage}`
          : null,
      );
      setBannerImagePreview(
        editData.bannerimage ? `${BASE_URL}${editData.bannerimage}` : null,
      );

      setSmallimage(null);
      setBannerimage(null);
    }
  }, [editData]);

  // Handle image selection with preview
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "Image size should be less than 5MB", "error");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        Swal.fire("Error", "Please select an image file", "error");
        return;
      }

      if (type === "small") {
        setSmallimage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSmallImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setBannerimage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setBannerImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Remove image
  const removeImage = (type) => {
    if (type === "small") {
      setSmallimage(null);
      setSmallImagePreview(null);
    } else {
      setBannerimage(null);
      setBannerImagePreview(null);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Category name is required";
    } else if (name.length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    } else if (name.length > 50) {
      newErrors.name = "Category name must be less than 50 characters";
    }

    if (displayOrder < 0) {
      newErrors.displayOrder = "Display order cannot be negative";
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return Swal.fire("Error", "Please fix the form errors", "error");
    }

    try {
      const fd = new FormData();

      fd.append("name", name);
      fd.append("displayOrder", displayOrder);
      fd.append("showOnHome", showOnHome);
      fd.append("isActive", isActive);
      if (description) fd.append("description", description);

      // Only append new images if they were selected
      if (smallimage) fd.append("smallimage", smallimage);
      if (bannerimage) fd.append("bannerimage", bannerimage);

      setLoading(true);

      if (editData) {
        await api.put(`/category/${editData._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/category", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Category ${editData ? "updated" : "created"} successfully`,
        timer: 2000,
        showConfirmButton: false,
      });

      refresh();
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to save category",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {editData ? "Edit Category" : "Create New Category"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editData
                ? "Update category information"
                : "Add a new category to your store"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* NAME */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#927f68] focus:border-[#927f68] transition-all ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder="e.g., Electronics, Fashion, Furniture"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#927f68] focus:border-[#927f68] transition-all resize-none"
              placeholder="Enter category description (optional)"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-gray-500 text-right">
              {description.length}/500 characters
            </p>
          </div>

          {/* DISPLAY ORDER */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Display Order
            </label>
            <input
              type="number"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#927f68] focus:border-[#927f68] transition-all ${
                errors.displayOrder
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="0"
              value={displayOrder}
              onChange={(e) => {
                setDisplayOrder(parseInt(e.target.value) || 0);
                if (errors.displayOrder)
                  setErrors({ ...errors, displayOrder: null });
              }}
              min="0"
            />
            {errors.displayOrder && (
              <p className="text-sm text-red-500">{errors.displayOrder}</p>
            )}
          </div>

          {/* TOGGLES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-700">Show on Homepage</p>
                <p className="text-sm text-gray-500">
                  Display this category on the homepage
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showOnHome}
                  onChange={() => setShowOnHome(!showOnHome)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {editData && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-700">Active Status</p>
                  <p className="text-sm text-gray-500">
                    Enable or disable this category
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            )}
          </div>

          {/* IMAGES */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Category Images</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Small Image */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Small Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center ${
                    smallImagePreview
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-[#927f68]"
                  } transition-colors`}
                >
                  {smallImagePreview ? (
                    <div className="relative">
                      <img
                        src={smallImagePreview}
                        alt="Small preview"
                        className="max-h-32 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("small")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        id="smallimage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "small")}
                        className="hidden"
                      />
                      <label
                        htmlFor="smallimage"
                        className="cursor-pointer block"
                      >
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[#927f68] font-medium">
                          Click to upload
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Banner Image */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Banner Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center ${
                    bannerImagePreview
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-[#927f68]"
                  } transition-colors`}
                >
                  {bannerImagePreview ? (
                    <div className="relative">
                      <img
                        src={bannerImagePreview}
                        alt="Banner preview"
                        className="max-h-100 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("banner")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        id="bannerimage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "banner")}
                        className="hidden"
                      />
                      <label
                        htmlFor="bannerimage"
                        className="cursor-pointer block"
                      >
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[#927f68] font-medium">
                          Click to upload
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-[#927f68] text-white rounded-xl hover:bg-[#7a6c5a] transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{editData ? "Update Category" : "Create Category"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
