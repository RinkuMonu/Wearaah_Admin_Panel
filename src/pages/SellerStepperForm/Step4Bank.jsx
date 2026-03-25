// steps/Step4Bank.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../serviceAuth/axios";
import {
  CreditCard,
  User,
  Hash,
  Banknote,
  Building2,
  QrCode,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react";

export default function Step4Bank({ onSuccess }) {
  const [form, setForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    IFSC: "",
    bankName: "",
    UPI: "",
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // 🔥 ACCOUNT NUMBER → only number
    if (name === "accountNumber") {
      value = value.replace(/\D/g, "");
    }

    // 🔥 IFSC → uppercase only
    if (name === "IFSC") {
      value = value.toUpperCase();
    }

    // 🔥 BANK NAME → only letters + space
    if (name === "bankName") {
      value = value.replace(/[^a-zA-Z ]/g, "");
    }

    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const { accountHolderName, accountNumber, IFSC, bankName } = form;

    if (!accountHolderName || !accountNumber || !IFSC || !bankName) {
      Swal.fire("Error", "All required fields must be filled", "warning");
      return false;
    }

    // Account number check
    if (accountNumber.length < 8) {
      Swal.fire("Error", "Account number must be at least 8 digits", "warning");
      return false;
    }

    if (accountNumber.length > 20) {
      Swal.fire("Error", "Account number cannot exceed 20 digits", "warning");
      return false;
    }

    // IFSC format (basic)
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(IFSC)) {
      Swal.fire("Error", "Invalid IFSC code. Format: ABCD0123456", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        bankDetails: {
          accountHolderName: form.accountHolderName,
          accountNumber: form.accountNumber,
          IFSC: form.IFSC,
          bankName: form.bankName,
          UPI: form.UPI || undefined, // 🔥 optional
        },
      };

      await api.post("/seller/bank", payload);

      Swal.fire("Success", "Bank details saved successfully", "success");

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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Bank Account Details
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Enter your bank information for payouts
        </p>
      </div>

      {/* ACCOUNT HOLDER */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "accountHolderName"
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          <User className="h-5 w-5" />
        </div>
        <input
          name="accountHolderName"
          placeholder="Account Holder Name"
          value={form.accountHolderName}
          onChange={handleChange}
          onFocus={() => setFocusedField("accountHolderName")}
          onBlur={() => setFocusedField(null)}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
        />
      </div>

      {/* ACCOUNT NUMBER */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "accountNumber" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Hash className="h-5 w-5" />
        </div>
        <input
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          onFocus={() => setFocusedField("accountNumber")}
          onBlur={() => setFocusedField(null)}
          maxLength="20"
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {form.accountNumber.length > 0 && (
            <span>{form.accountNumber.length}/20</span>
          )}
        </div>
      </div>

      {/* IFSC */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "IFSC" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Banknote className="h-5 w-5" />
        </div>
        <input
          name="IFSC"
          placeholder="IFSC Code"
          value={form.IFSC}
          onChange={handleChange}
          onFocus={() => setFocusedField("IFSC")}
          onBlur={() => setFocusedField(null)}
          maxLength="11"
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none uppercase"
        />
      </div>

      {/* IFSC Format Hint */}
      <div className="mt-1 mb-2">
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Format: ABCD0123456 (4 letters, 0, 6 alphanumeric)
        </div>
      </div>

      {/* BANK NAME */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "bankName" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Building2 className="h-5 w-5" />
        </div>
        <input
          name="bankName"
          placeholder="Bank Name"
          value={form.bankName}
          onChange={handleChange}
          onFocus={() => setFocusedField("bankName")}
          onBlur={() => setFocusedField(null)}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
        />
      </div>

      {/* UPI (optional) */}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "UPI" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <QrCode className="h-5 w-5" />
        </div>
        <input
          name="UPI"
          placeholder="UPI ID (optional)"
          value={form.UPI}
          onChange={handleChange}
          onFocus={() => setFocusedField("UPI")}
          onBlur={() => setFocusedField(null)}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
        />
      </div>

      {/* UPI Info */}
      {!form.UPI && (
        <div className="mt-1 mb-2">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <QrCode className="w-3 h-3" />
            Add UPI ID for faster payouts (optional)
          </div>
        </div>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving Bank Details...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* INFO NOTE */}
      <div className="mt-4 space-y-2">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">
                Your bank details are encrypted and secure. We use this
                information for:
              </p>
              <ul className="text-xs text-gray-500 mt-1 space-y-1 ml-4 list-disc">
                <li>Processing payouts for your sales</li>
                <li>Refund processing</li>
                <li>Commission settlements</li>
              </ul>
            </div>
          </div>
        </div>

        {form.accountNumber &&
          form.accountNumber.length > 0 &&
          form.accountNumber.length < 8 && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Account number should be at least 8 digits. Please verify
                  before proceeding.
                </p>
              </div>
            </div>
          )}

        {form.IFSC &&
          !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.IFSC) &&
          form.IFSC.length > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Invalid IFSC format. Example: SBIN0012345
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
