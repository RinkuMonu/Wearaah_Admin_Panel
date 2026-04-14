import { useState, useEffect } from "react";
import api from "../../serviceAuth/axios";
import { useAuth } from "../../serviceAuth/context";
import Swal from "sweetalert2";
import {
  Building2,
  CreditCard,
  Landmark,
  Wallet,
  Edit2,
  Save,
  X,
  Loader2,
  Banknote,
  User,
  Shield,
  AlertCircle,
} from "lucide-react";

export default function BankDetails({seller}) {
  // const { sellerData } = useAuth();
  // const sellerDD = sellerData?.seller || {};

    const sellerDD = seller;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    IFSC: "",
    bankName: "",
    UPI: "",
  });

  useEffect(() => {
    if (sellerDD?.bankDetails) {
      setFormData({
        accountHolderName: sellerDD.bankDetails.accountHolderName || "",
        accountNumber: sellerDD.bankDetails.accountNumber || "",
        IFSC: sellerDD.bankDetails.IFSC || "",
        bankName: sellerDD.bankDetails.bankName || "",
        UPI: sellerDD.bankDetails.UPI || "",
      });
    }
  }, [sellerDD]);

  // Validation functions
  const validateAccountHolderName = (name) => {
    if (!name) return "Account holder name is required";
    const alphaRegex = /^[A-Za-z\s]+$/;
    if (!alphaRegex.test(name)) {
      return "Only alphabets and spaces are allowed";
    }
    if (name.length < 3) {
      return "Name must be at least 3 characters";
    }
    if (name.length > 50) {
      return "Name must be less than 50 characters";
    }
    return "";
  };

  const validateAccountNumber = (number) => {
    if (!number) return "Account number is required";
    const numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(number)) {
      return "Only numbers are allowed";
    }
    if (number.length < 9 || number.length > 18) {
      return "Account number must be between 9 and 18 digits";
    }
    return "";
  };

  const validateIFSC = (ifsc) => {
    if (!ifsc) return "IFSC code is required";
    // IFSC format: First 4 letters, then 0, then 6 alphanumeric
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifsc.toUpperCase())) {
      return "Invalid IFSC code (e.g., HDFC0001234)";
    }
    return "";
  };

  const validateBankName = (name) => {
    if (!name) return "Bank name is required";
    const alphaRegex = /^[A-Za-z\s]+$/;
    if (!alphaRegex.test(name)) {
      return "Only alphabets and spaces are allowed";
    }
    if (name.length < 2) {
      return "Bank name must be at least 2 characters";
    }
    if (name.length > 50) {
      return "Bank name must be less than 50 characters";
    }
    return "";
  };

  const validateUPI = (upi) => {
    if (!upi) return ""; // UPI is optional
    // UPI format: username@bankhandle
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiRegex.test(upi)) {
      return "Invalid UPI ID (e.g., username@okhdfcbank)";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    let error = "";

    // Apply input restrictions and validation
    switch (name) {
      case "accountHolderName":
        // Only allow alphabets and spaces
        processedValue = value.replace(/[^A-Za-z\s]/g, "");
        error = validateAccountHolderName(processedValue);
        break;

      case "accountNumber":
        // Only allow numbers
        processedValue = value.replace(/[^0-9]/g, "");
        error = validateAccountNumber(processedValue);
        break;

      case "IFSC":
        // Convert to uppercase and allow alphanumeric
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        error = validateIFSC(processedValue);
        break;

      case "bankName":
        // Only allow alphabets and spaces
        processedValue = value.replace(/[^A-Za-z\s]/g, "");
        error = validateBankName(processedValue);
        break;

      case "UPI":
        // Allow alphanumeric, ., _, - and @
        processedValue = value.toLowerCase();
        error = validateUPI(processedValue);
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

  const validateForm = () => {
    const newErrors = {
      accountHolderName: validateAccountHolderName(formData.accountHolderName),
      accountNumber: validateAccountNumber(formData.accountNumber),
      IFSC: validateIFSC(formData.IFSC),
      bankName: validateBankName(formData.bankName),
      UPI: validateUPI(formData.UPI),
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fix the errors before saving",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        IFSC: formData.IFSC.toUpperCase(),
        bankName: formData.bankName,
        UPI: formData.UPI.toLowerCase(),
      };

      // const res = await api.put("/seller/profile/update", payload);
      const id = seller?.userId?._id;

      const res = await api.put(`/seller/profile/update/${id}`, payload);

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: res.data.message || "Bank details updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsEditing(false);
        setErrors({});
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating bank details:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update bank details",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (sellerDD?.bankDetails) {
      setFormData({
        accountHolderName: sellerDD.bankDetails.accountHolderName || "",
        accountNumber: sellerDD.bankDetails.accountNumber || "",
        IFSC: sellerDD.bankDetails.IFSC || "",
        bankName: sellerDD.bankDetails.bankName || "",
        UPI: sellerDD.bankDetails.UPI || "",
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  // Format account number for display (masked)
  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return "N/A";
    if (!isEditing && accountNumber.length > 8) {
      const lastFour = accountNumber.slice(-4);
      const maskedLength = accountNumber.length - 4;
      const masked = "*".repeat(Math.min(maskedLength, 8));
      return `${masked}${lastFour}`;
    }
    return accountNumber;
  };

  // Format IFSC for display
  const formatIFSC = (ifsc) => {
    if (!ifsc) return "N/A";
    return ifsc.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <Banknote className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-800">Bank Details</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-4 h-4" />
              Account Holder Name
              <span className="text-red-500 text-xs">*</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.accountHolderName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter account holder name"
                  maxLength={50}
                />
                {errors.accountHolderName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.accountHolderName}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800 font-medium">
                {formData.accountHolderName || "N/A"}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Account Number
              <span className="text-red-500 text-xs">*</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.accountNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter account number"
                  maxLength={18}
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.accountNumber}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800 font-mono">
                {formatAccountNumber(formData.accountNumber)}
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              IFSC Code
              <span className="text-red-500 text-xs">*</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="IFSC"
                  value={formData.IFSC}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                    errors.IFSC ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter IFSC code (e.g., HDFC0001234)"
                  maxLength={11}
                />
                {errors.IFSC && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.IFSC}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800 uppercase">
                {formatIFSC(formData.IFSC)}
              </p>
            )}
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Landmark className="w-4 h-4" />
              Bank Name
              <span className="text-red-500 text-xs">*</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.bankName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter bank name"
                  maxLength={50}
                />
                {errors.bankName && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.bankName}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800">{formData.bankName || "N/A"}</p>
            )}
          </div>

          {/* UPI ID */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              UPI ID
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="UPI"
                  value={formData.UPI}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.UPI ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter UPI ID (e.g., username@okhdfcbank)"
                  maxLength={50}
                />
                {errors.UPI && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.UPI}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800">{formData.UPI || "N/A"}</p>
            )}
          </div>
        </div>

        {/* Validation Summary */}
        {isEditing && Object.values(errors).some((error) => error !== "") && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Please fix the validation errors before saving
            </p>
          </div>
        )}

        {/* Info Note */}
        {!isEditing && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Your bank details are secure and encrypted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
