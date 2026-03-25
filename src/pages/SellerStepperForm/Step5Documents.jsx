// steps/Step5Documents.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../serviceAuth/axios";
import {
  FileText,
  IdCard,
  Fingerprint,
  Store,
  Banknote,
  FileCheck,
  CheckSquare,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileWarning,
  Building2,
  CreditCard,
} from "lucide-react";

export default function Step5Documents({ onSuccess }) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // 👉 get businessType from previous step (optional improvement)
  const businessType = localStorage.getItem("businessType") || "individual";

  const handleFile = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "File size should be less than 5MB", "warning");
        return;
      }

      setFiles({ ...files, [name]: file });
      setUploadProgress({ ...uploadProgress, [name]: 100 });
    }
  };

  const validate = () => {
    if (
      !files.panCard ||
      !files.aadhaarFront ||
      !files.aadhaarBack ||
      !files.shopLicense ||
      !files.cancelledCheque
    ) {
      Swal.fire("Error", "All required documents must be uploaded", "warning");
      return false;
    }

    if (businessType !== "individual" && !files.gstCertificate) {
      Swal.fire("Error", "GST Certificate required", "warning");
      return false;
    }

    if (!termsAccepted) {
      Swal.fire("Error", "Please accept terms & conditions", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("termsAccepted", "true");

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      await api.post("/seller/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "KYC Submitted Successfully 🎉", "success");

      onSuccess(); // final step
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Upload failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label,
    name,
    required = true,
    icon,
    description = "",
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {icon}
          {label}
          {required && <span className="text-red-500 text-xs">*</span>}
        </label>
        {files[name] && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Uploaded
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type="file"
          name={name}
          accept="image/*,application/pdf"
          onChange={handleFile}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          id={`file-${name}`}
        />
        <div
          className={`
          w-full border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200
          ${
            files[name]
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }
        `}
        >
          <div className="flex flex-col items-center gap-2">
            {files[name] ? (
              <>
                <FileCheck className="w-8 h-8 text-green-600" />
                <div className="text-sm font-medium text-green-600">
                  {files[name].name}
                </div>
                <div className="text-xs text-gray-500">
                  {(files[name].size / 1024).toFixed(2)} KB
                </div>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  Click to upload {label}
                </div>
                <div className="text-xs text-gray-400">
                  PDF, JPG, PNG (Max 5MB)
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {description && !files[name] && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {description}
        </p>
      )}
    </div>
  );

  const documentSections = {
    personal: [
      {
        label: "PAN Card",
        name: "panCard",
        icon: <IdCard className="w-4 h-4" />,
        description: "Clear photo of your PAN card",
      },
      {
        label: "Aadhaar Card (Front)",
        name: "aadhaarFront",
        icon: <Fingerprint className="w-4 h-4" />,
        description: "Front side with photo and details",
      },
      {
        label: "Aadhaar Card (Back)",
        name: "aadhaarBack",
        icon: <Fingerprint className="w-4 h-4" />,
        description: "Back side with QR code",
      },
    ],
    business: [
      {
        label: "Shop License / Trade Certificate",
        name: "shopLicense",
        icon: <Store className="w-4 h-4" />,
        description: "Government issued shop license",
      },
      {
        label: "Cancelled Cheque",
        name: "cancelledCheque",
        icon: <Banknote className="w-4 h-4" />,
        description: "Cancelled cheque for bank verification",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Document Verification
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload required documents for KYC verification
        </p>
      </div>

      {/* PERSONAL DOCUMENTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <Shield className="w-5 h-5 text-gray-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Personal Identification
          </h4>
        </div>

        {documentSections.personal.map((doc) =>
          renderInput(doc.label, doc.name, true, doc.icon, doc.description),
        )}
      </div>

      {/* BUSINESS DOCUMENTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <Building2 className="w-5 h-5 text-gray-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Business Documents
          </h4>
        </div>

        {documentSections.business.map((doc) =>
          renderInput(doc.label, doc.name, true, doc.icon, doc.description),
        )}
      </div>

      {/* GST CONDITIONAL */}
      {businessType !== "individual" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h4 className="text-md font-semibold text-gray-800">
              Tax Documents
            </h4>
          </div>

          {renderInput(
            "GST Certificate",
            "gstCertificate",
            true,
            <FileWarning className="w-4 h-4" />,
            "GST registration certificate (required for non-individual businesses)",
          )}
        </div>
      )}

      {/* TERMS & CONDITIONS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            className="mt-0.5 w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />I accept the Terms & Conditions
            </label>
            <p className="text-xs text-gray-500 mt-1">
              By accepting, you agree to our seller agreement, privacy policy,
              and confirm that all provided information is accurate and
              authentic.
            </p>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading Documents...
          </>
        ) : (
          <>
            <FileCheck className="h-5 w-5" />
            Submit KYC for Verification
          </>
        )}
      </button>

      {/* INFO NOTE */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium text-blue-800">
              Important Information
            </p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1 ml-4 list-disc">
              <li>All documents should be clear and readable</li>
              <li>Maximum file size: 5MB per document</li>
              <li>Supported formats: PDF, JPG, PNG</li>
              <li>Verification typically takes 24-48 hours</li>
              {businessType !== "individual" && (
                <li>
                  GST certificate is mandatory for non-individual businesses
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* UPLOAD SUMMARY */}
      {Object.keys(files).length > 0 && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-green-800">
                Uploaded Documents
              </p>
              <p className="text-xs text-green-700 mt-1">
                {Object.keys(files).length} of{" "}
                {businessType !== "individual" ? 6 : 5} documents uploaded
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
