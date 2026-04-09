// steps/Step2Business.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../serviceAuth/axios";
import {
  Store,
  Briefcase,
  Clock,
  FileText,
  Building2,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function Step2Business({ onSuccess }) {
  const [form, setForm] = useState({
    shopName: "",
    businessType: "individual",
    yearOfExperience: "",
    PAN: "",
    GSTIN: "",
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // ✅ GSTIN
    if (name === "GSTIN") {
      value = value.toUpperCase(); // uppercase auto

      value = value.replace(/[^0-9A-Z]/g, "");
      if (value.length > 15) return;
    }

    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const { shopName, businessType, yearOfExperience, PAN, GSTIN } = form;

    if (!shopName || !businessType || !yearOfExperience || !PAN) {
      Swal.fire("Error", "All required fields must be filled", "warning");
      return false;
    }

    // PAN validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(PAN)) {
      Swal.fire("Error", "Invalid PAN format", "warning");
      return false;
    }

    // GST only if not individual
    if (businessType !== "individual" && !GSTIN) {
      Swal.fire("Error", "GSTIN is required", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        shopName: form.shopName,
        businessType: form.businessType,
        yearOfExperience: form.yearOfExperience,
        PAN: form.PAN,
      };

      // 👉 GST only if required
      if (form.businessType !== "individual") {
        payload.GSTIN = form.GSTIN;
      }

      await api.post("/seller/basic", payload);

      Swal.fire("Success", "Business info saved", "success");

      onSuccess(); // 🔥 next step unlock
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    {
      value: "individual",
      label: "Individual",
      icon: Briefcase,
      description: "Sole proprietor",
    },
    {
      value: "proprietorship",
      label: "Proprietorship",
      icon: Building2,
      description: "Single owner business",
    },
    {
      value: "partnership",
      label: "Partnership",
      icon: Building2,
      description: "Multiple owners",
    },
    {
      value: "pvt_ltd",
      label: "Private Ltd",
      icon: Building2,
      description: "Private limited company",
    },
  ];

  const experienceOptions = [
    { value: "", label: "Select Experience" },
    { value: "0-1", label: "0-1 Years", description: "Just starting out" },
    { value: "1-3", label: "1-3 Years", description: "Growing business" },
    { value: "3-5", label: "3-5 Years", description: "Established" },
    { value: "5+", label: "5+ Years", description: "Experienced" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Business Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us about your business for verification
        </p>
      </div>

      {/* Shop Name */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "shopName" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Store className="h-5 w-5" />
        </div>
        <input
          name="shopName"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={handleChange}
          onFocus={() => setFocusedField("shopName")}
          onBlur={() => setFocusedField(null)}
          onKeyPress={(e) => {
            if (!/[A-Za-z\s]/.test(e.key)) e.preventDefault();
          }}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
        />
      </div>

      {/* Business Type */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "businessType" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Briefcase className="h-5 w-5" />
        </div>
        <select
          name="businessType"
          value={form.businessType}
          onChange={handleChange}
          onFocus={() => setFocusedField("businessType")}
          onBlur={() => setFocusedField(null)}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
        >
          {businessTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Business Type Info */}
      <div className="mt-1 mb-2">
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
          <span className="font-medium">Selected: </span>
          {
            businessTypes.find((t) => t.value === form.businessType)
              ?.description
          }
        </div>
      </div>

      {/* Experience */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "yearOfExperience"
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          <Clock className="h-5 w-5" />
        </div>
        <select
          name="yearOfExperience"
          value={form.yearOfExperience}
          onChange={handleChange}
          onFocus={() => setFocusedField("yearOfExperience")}
          onBlur={() => setFocusedField(null)}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
        >
          {experienceOptions.map((exp) => (
            <option key={exp.value} value={exp.value}>
              {exp.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Experience Info */}
      {form.yearOfExperience && (
        <div className="mt-1 mb-2">
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            <span className="font-medium">Experience level: </span>
            {
              experienceOptions.find(
                (exp) => exp.value === form.yearOfExperience,
              )?.description
            }
          </div>
        </div>
      )}

      {/* PAN */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "PAN" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <FileText className="h-5 w-5" />
        </div>
        <input
          name="PAN"
          placeholder="PAN Number"
          value={form.PAN}
          onChange={(e) =>
            setForm({ ...form, PAN: e.target.value.toUpperCase() })
          }
          onFocus={() => setFocusedField("PAN")}
          onBlur={() => setFocusedField(null)}
          maxLength="10"
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none uppercase"
        />
      </div>

      {/* PAN Format Hint */}
      <div className="mt-1 mb-2">
        <div className="text-xs text-gray-400">
          Format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
        </div>
      </div>

      {/* GST (conditional) */}
      {form.businessType !== "individual" && (
        <div className="relative">
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
              focusedField === "GSTIN" ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <Building2 className="h-5 w-5" />
          </div>
          <input
            name="GSTIN"
            placeholder="GST Number"
            value={form.GSTIN}
            onChange={handleChange}
            onFocus={() => setFocusedField("GSTIN")}
            onBlur={() => setFocusedField(null)}
            onKeyPress={(e) => {
              if (!/[0-9A-Za-z]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving Business Information...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* INFO NOTE */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
          <p className="text-xs text-gray-500">
            Your business information is secure and will be used for
            verification purposes only.
            {form.businessType !== "individual" &&
              " GSTIN is mandatory for non-individual businesses."}
          </p>
        </div>
      </div>
    </div>
  );
}
