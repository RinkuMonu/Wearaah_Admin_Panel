import React, { useState } from "react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";

export default function EditBrandModal({ data, onClose, refresh }) {
  console.log(data);
  const [form, setForm] = useState({
    name: data.name || "",
    tagline: data.tagline || "",
    description: data.description || "",
    brandType: data.brandType || "",
    gstNumber: data.gstNumber || "",
    supportEmail: data.supportEmail || "",
    supportPhone: data.supportPhone || "",
    countryOfOrigin: data.countryOfOrigin || "",
    websiteUrl: data.websiteUrl || "",
    establishedYear: data.establishedYear || "",
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const brandTypes = ["own", "reseller"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const validateForm = () => {
    const required = [
      "name",
      "tagline",
      "description",
      "brandType",
      "gstNumber",
      "supportEmail",
      "supportPhone",
      "websiteUrl",
    ];

    for (let key of required) {
      if (!form[key] || !form[key].trim()) {
        Swal.fire(
          "Error",
          `${key.replace(/([A-Z])/g, " $1").trim()} is required`,
          "error",
        );
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.supportEmail)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return false;
    }

    // Phone validation (basic)
    if (form.supportPhone.length < 10) {
      Swal.fire("Error", "Please enter a valid phone number", "error");
      return false;
    }

    // GST validation (basic Indian GST format)
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(form.gstNumber)) {
      Swal.fire("Error", "Please enter a valid GST number", "error");
      return false;
    }

    return true;
  };

  const update = async () => {
    if (!validateForm()) return;

    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      if (form[k]) fd.append(k, form[k]);
    });
    if (logo) fd.append("logo", logo);

    try {
      setLoading(true);
      await api.put(`/brand/${data._id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Brand updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      refresh();
      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update brand",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border border-[#e6dcc7] p-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-6 border-b border-[#e6dcc7] pb-4">
      <h2 className="text-2xl font-semibold text-[#5c5042]">
        Edit Brand
      </h2>
      <button
        onClick={onClose}
        className="text-[#927f68] hover:text-[#5c5042] text-2xl transition"
      >
        &times;
      </button>
    </div>

    <div className="grid grid-cols-2 gap-5">

      {/* Brand Name */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">Brand Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleInputChange}
          placeholder="Enter brand name"
          className="input-style"
        />
      </div>

      {/* Brand Type */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">Brand Type *</label>
        <select
          name="brandType"
          value={form.brandType}
          onChange={handleInputChange}
          className="input-style"
        >
          <option value="">Select Type</option>
          {brandTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Tagline */}
      <div className="col-span-2">
        <label className="label-style">Tagline *</label>
        <input
          name="tagline"
          value={form.tagline}
          onChange={handleInputChange}
          placeholder="Enter brand tagline"
          className="input-style"
        />
      </div>

      {/* Description */}
      <div className="col-span-2">
        <label className="label-style">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Enter brand description"
          rows="3"
          className="input-style resize-none"
        />
      </div>

      {/* GST */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">GST Number *</label>
        <input
          name="gstNumber"
          value={form.gstNumber}
          onChange={handleInputChange}
          placeholder="Enter GST number"
          className="input-style"
        />
      </div>

      {/* Country */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">Country of Origin</label>
        <input
          name="countryOfOrigin"
          value={form.countryOfOrigin}
          onChange={handleInputChange}
          placeholder="Enter country"
          className="input-style"
        />
      </div>

      {/* Support Email */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">Support Email *</label>
        <input
          type="email"
          name="supportEmail"
          value={form.supportEmail}
          onChange={handleInputChange}
          placeholder="Enter support email"
          className="input-style"
        />
      </div>

      {/* Support Phone */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">Support Phone *</label>
        <input
          name="supportPhone"
          value={form.supportPhone}
          onChange={handleInputChange}
          placeholder="Enter support phone"
          className="input-style"
        />
      </div>

      {/* Website */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">Website</label>
        <input
          name="websiteUrl"
          value={form.websiteUrl}
          onChange={handleInputChange}
          placeholder="Enter website URL"
          className="input-style"
        />
      </div>

      {/* Established Year */}
      <div className="col-span-2 sm:col-span-1">
        <label className="label-style">Established Year</label>
        <input
          type="number"
          name="establishedYear"
          value={form.establishedYear}
          onChange={handleInputChange}
          placeholder="Enter year"
          min="1800"
          max={new Date().getFullYear()}
          className="input-style"
        />
      </div>

      {/* Logo Upload */}
      <div className="col-span-2">
        <label className="label-style">
          Brand Logo {!logo && "(Current logo will be kept if not changed)"}
        </label>

        <div className="flex items-center gap-4 bg-white border border-dashed border-[#cbbca5] rounded-xl p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-[#5c5042]"
          />

          <img
            src={previewUrl || `${BASE_URL}/${data.logo}`}
            alt="Brand"
            className="w-16 h-16 object-cover"
          />
        </div>

        <p className="text-xs text-[#8b7a63] mt-2">
          Supported formats: JPG, PNG, GIF (Max size: 5MB)
        </p>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#e6dcc7]">
      <button
        onClick={onClose}
        disabled={loading}
        className="px-5 py-2 rounded-md border border-[#927f68] text-[#927f68] hover:bg-[#927f68] hover:text-white transition"
      >
        Cancel
      </button>

      <button
        onClick={update}
        disabled={loading}
        className="px-6 py-2 rounded-md bg-[#927f68] text-white hover:bg-[#7b6b57] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Brand"}
      </button>
    </div>
  </div>
</div>
  );
}
