import { useState, useEffect } from "react";
import api from "../../serviceAuth/axios";
import { useAuth } from "../../serviceAuth/context";
import Swal from "sweetalert2";
import {
  FileText,
  Upload,
  Eye,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  FileCheck,
  CreditCard,
  Building2,
  Shield,
  Download,
  Trash2,
  File,
  FileImage,
  FileArchive,
} from "lucide-react";

export default function KycDetails() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { sellerData } = useAuth();
  const sellerDD = sellerData?.seller || {};

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    PAN: "",
    GSTIN: "",
  });
  const [files, setFiles] = useState({});
  const [existingDocuments, setExistingDocuments] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sellerDD) {
      setFormData({
        PAN: sellerDD.PAN || "",
        GSTIN: sellerDD.GSTIN || "",
      });
      setExistingDocuments(sellerDD.kycDocuments || {});
    }
  }, [sellerDD]);

  // Validation functions
  const validatePAN = (pan) => {
    if (!pan) return "PAN number is required";
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan.toUpperCase())) {
      return "Invalid PAN number (e.g., ABCDE1234F)";
    }
    return "";
  };

  const validateGSTIN = (gstin) => {
    if (!gstin) return ""; // GST is optional
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gstin.toUpperCase())) {
      return "Invalid GST number";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    let error = "";

    switch (name) {
      case "PAN":
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        error = validatePAN(processedValue);
        break;
      case "GSTIN":
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        error = validateGSTIN(processedValue);
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "File size should be less than 5MB", "error");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire(
          "Error",
          "Only JPEG, PNG, and PDF files are allowed",
          "error",
        );
        return;
      }

      setFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
  };

  const validateForm = () => {
    const newErrors = {
      PAN: validatePAN(formData.PAN),
      GSTIN: validateGSTIN(formData.GSTIN),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fix the errors before saving",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setLoading(true);

      const formDataPayload = new FormData();

      // Add PAN and GSTIN
      formDataPayload.append("PAN", formData.PAN);
      if (formData.GSTIN) formDataPayload.append("GSTIN", formData.GSTIN);

      // Add files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formDataPayload.append(key, files[key]);
        }
      });

      const res = await api.put("/seller/profile/update", formDataPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: res.data.message || "KYC details updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsEditing(false);
        setFiles({});
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating KYC details:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update KYC details",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      PAN: sellerDD.PAN || "",
      GSTIN: sellerDD.GSTIN || "",
    });
    setFiles({});
    setErrors({});
    setIsEditing(false);
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `http://localhost:5000${path}`;
    return `http://localhost:5000/uploads/${path.split("\\").pop()}`;
  };

  const getKycStatusBadge = () => {
    const status = sellerDD.kycStatus;
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Approved",
          color: "bg-green-100 text-green-700",
        };
      case "rejected":
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Rejected",
          color: "bg-red-100 text-red-700",
        };
      case "submitted":
        return {
          icon: <Clock className="w-4 h-4" />,
          text: "Under Review",
          color: "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Pending",
          color: "bg-gray-100 text-gray-700",
        };
    }
  };

  const statusBadge = getKycStatusBadge();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-800">KYC Details</h3>
          {sellerDD.kycStatus && (
            <span
              className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
            >
              {statusBadge.icon}
              {statusBadge.text}
            </span>
          )}
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* PAN and GST Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              PAN Number
              <span className="text-red-500 text-xs">*</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="PAN"
                  value={formData.PAN}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                    errors.PAN ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter PAN number (e.g., ABCDE1234F)"
                  maxLength={10}
                />
                {errors.PAN && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.PAN}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800 font-mono">{formData.PAN || "N/A"}</p>
            )}
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              GST Number
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="GSTIN"
                  value={formData.GSTIN}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                    errors.GSTIN ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter GST number"
                  maxLength={15}
                />
                {errors.GSTIN && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.GSTIN}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800">{formData.GSTIN || "N/A"}</p>
            )}
          </div>
        </div>

        {/* KYC Documents */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            KYC Documents
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Aadhaar Front */}
            <DocumentUpload
              label="Aadhaar Card (Front)"
              name="aadhaarFront"
              existingFile={existingDocuments.aadhaarFront}
              file={files.aadhaarFront}
              onFileChange={handleFileChange}
              onRemove={() => removeFile("aadhaarFront")}
              isEditing={isEditing}
              required={true}
            />

            {/* Aadhaar Back */}
            <DocumentUpload
              label="Aadhaar Card (Back)"
              name="aadhaarBack"
              existingFile={existingDocuments.aadhaarBack}
              file={files.aadhaarBack}
              onFileChange={handleFileChange}
              onRemove={() => removeFile("aadhaarBack")}
              isEditing={isEditing}
              required={true}
            />

            {/* PAN Card */}
            <DocumentUpload
              label="PAN Card"
              name="panCard"
              existingFile={existingDocuments.panCard}
              file={files.panCard}
              onFileChange={handleFileChange}
              onRemove={() => removeFile("panCard")}
              isEditing={isEditing}
              required={true}
            />

            {/* GST Certificate */}
            <DocumentUpload
              label="GST Certificate"
              name="gstCertificate"
              existingFile={existingDocuments.gstCertificate}
              file={files.gstCertificate}
              onFileChange={handleFileChange}
              onRemove={() => removeFile("gstCertificate")}
              isEditing={isEditing}
              required={false}
            />

            {/* Shop License */}
            <DocumentUpload
              label="Shop License"
              name="shopLicense"
              existingFile={existingDocuments.shopLicense}
              file={files.shopLicense}
              onFileChange={handleFileChange}
              onRemove={() => removeFile("shopLicense")}
              isEditing={isEditing}
              required={false}
            />

            {/* Cancelled Cheque */}
            <DocumentUpload
              label="Cancelled Cheque"
              name="cancelledCheque"
              existingFile={existingDocuments.cancelledCheque}
              file={files.cancelledCheque}
              onFileChange={handleFileChange}
              onRemove={() => removeFile("cancelledCheque")}
              isEditing={isEditing}
              required={false}
            />
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {sellerDD.kycStatus === "rejected" && sellerDD.rejectionReason && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Rejection Reason:
            </p>
            <p className="text-sm text-red-700 mt-1">
              {sellerDD.rejectionReason}
            </p>
          </div>
        )}

        {/* Info Note */}
        {!isEditing && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Your documents are securely stored and encrypted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Document Upload Component with PDF Support
function DocumentUpload({
  label,
  name,
  existingFile,
  file,
  onFileChange,
  onRemove,
  isEditing,
  required = false,
}) {
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    if (file) {
      // Check if file is PDF
      if (file.type === "application/pdf") {
        setFileType("pdf");
        setPreview(null);
      } else {
        // For images, create preview
        setFileType("image");
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPreview(null);
      setFileType(null);
    }
  }, [file]);

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${BASE_URL}${path}`;
    return `http://localhost:5000/uploads/${path.split("\\").pop()}`;
  };

  const openDocument = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getFileIcon = () => {
    if (fileType === "pdf") {
      return <FileArchive className="w-8 h-8 text-red-500" />;
    }
    return <FileImage className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 text-xs ml-1">*</span>}
      </label>

      {!isEditing ? (
        // View Mode
        <div>
          {existingFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {existingFile.toLowerCase().endsWith(".pdf") ? (
                  <FileArchive className="w-5 h-5 text-red-500" />
                ) : (
                  <FileCheck className="w-5 h-5 text-green-600" />
                )}
                <span className="text-sm text-gray-600">
                  {existingFile.toLowerCase().endsWith(".pdf")
                    ? "PDF Document"
                    : "Image uploaded"}
                </span>
              </div>
              <button
                onClick={() => openDocument(getFileUrl(existingFile))}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No document uploaded</p>
          )}
        </div>
      ) : (
        // Edit Mode
        <div>
          {file ? (
            <div className="space-y-2">
              {/* Preview based on file type */}
              {fileType === "image" && preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-32 rounded-lg object-cover border"
                  />
                </div>
              )}

              {fileType === "pdf" && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  {getFileIcon()}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {fileType === "pdf" ? "PDF document ready" : "Image ready"}
                </span>
                <button
                  onClick={onRemove}
                  className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ) : existingFile ? (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {existingFile.toLowerCase().endsWith(".pdf") ? (
                  <FileArchive className="w-5 h-5 text-red-500" />
                ) : (
                  <FileCheck className="w-5 h-5 text-green-600" />
                )}
                <span className="text-sm text-gray-600">
                  Current:{" "}
                  {existingFile.toLowerCase().endsWith(".pdf")
                    ? "PDF"
                    : "Image"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openDocument(getFileUrl(existingFile))}
                  className="text-blue-600 hover:text-blue-700"
                  title="View current document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={onRemove}
                  className="text-red-600 hover:text-red-700"
                  title="Remove current document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-3">
            <label className="block">
              <span className="sr-only">Choose file</span>
              <input
                type="file"
                name={name}
                onChange={onFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Max size: 10MB. Allowed: JPG, PNG, PDF
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
