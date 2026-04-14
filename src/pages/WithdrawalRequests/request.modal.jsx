import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Wallet,
  CreditCard,
  Building2,
  Landmark,
  User,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Banknote,
  ArrowRight,
  Shield,
  IndianRupeeIcon,
} from "lucide-react";
import api from "../../serviceAuth/axios";
import { useAuth } from "../../serviceAuth/context";

export default function WithdrawalRequestModal({ isOpen, setIsOpen }) {
  const { walletAmount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank_transfer");
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [sellerBankDetails, setSellerBankDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [withdrawalFee, setWithdrawalFee] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  // Calculate withdrawal amount after fee
  useEffect(() => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0) {
      const fee = amt * 0.02; // 2% fee
      setWithdrawalFee(fee);
      setCalculatedAmount(amt - fee);
    } else {
      setWithdrawalFee(0);
      setCalculatedAmount(0);
    }
  }, [amount]);

  // Validation functions
  const validateAmount = (amt) => {
    if (!amt) return "Amount is required";
    if (isNaN(amt)) return "Please enter a valid number";
    if (amt < 100) return "Minimum withdrawal amount is₱100";
    if (amt > walletAmount)
      return `Maximum withdrawal amount is ${walletAmount?.toLocaleString() || 0}`;
    return "";
  };

  const validateBankDetails = () => {
    const newErrors = {};

    if (selectedMethod === "bank_transfer") {
      if (!bankDetails.accountHolderName)
        newErrors.accountHolderName = "Account holder name is required";
      if (!bankDetails.accountNumber)
        newErrors.accountNumber = "Account number is required";
      if (!bankDetails.ifscCode) newErrors.ifscCode = "IFSC code is required";
      if (!bankDetails.bankName) newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers (no decimals for simplicity)
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
      const error = validateAmount(value);
      setErrors((prev) => ({ ...prev, amount: error }));
    }
  };

  // Restrict input: only letters and spaces for names
  const handleNameChange = (field, value) => {
    const cleaned = value.replace(/[^A-Za-z\s]/g, "");
    setBankDetails((prev) => ({ ...prev, [field]: cleaned }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Restrict input: only numbers for account number
  const handleAccountNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, "");
    setBankDetails((prev) => ({ ...prev, accountNumber: cleaned }));
    setErrors((prev) => ({ ...prev, accountNumber: "" }));
  };

  // IFSC code: alphanumeric, uppercase
  const handleIfscChange = (value) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    setBankDetails((prev) => ({ ...prev, ifscCode: cleaned }));
    setErrors((prev) => ({ ...prev, ifscCode: "" }));
  };

  const handleSubmit = async () => {
    // Validate amount
    const amountError = validateAmount(amount);
    if (amountError) {
      setErrors((prev) => ({ ...prev, amount: amountError }));
      Swal.fire("Error", amountError, "error");
      return;
    }

    // Validate bank details if needed
    if (selectedMethod === "bank_transfer" && !validateBankDetails()) {
      Swal.fire("Error", "Please fill all bank details", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        amount: parseFloat(amount),
        paymentMethod: selectedMethod,
        bankDetails:
          selectedMethod === "bank_transfer"
            ? {
                accountHolderName: bankDetails.accountHolderName,
                accountNumber: bankDetails.accountNumber,
                ifscCode: bankDetails.ifscCode,
                bankName: bankDetails.bankName,
              }
            : null,
      };

      const response = await api.post("/withdrawalreq/req", payload);

      if (response.data.success) {
        Swal.fire({
          title: "Request Submitted!",
          text: `Your withdrawal request of ${parseFloat(amount).toLocaleString()} has been submitted successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        resetForm();
        setIsOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Withdrawal request error:", error);
      Swal.fire({
        title: "info",
        text:
          error.response?.data?.message ||
          "Failed to submit withdrawal request",
        icon: "info",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setSelectedMethod("bank_transfer");
    setBankDetails({
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    });
    setErrors({});
    setWithdrawalFee(0);
    setCalculatedAmount(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div className="flex justify-between items-center w-full">
              <div className=" p-1.5 bg-blue-50 rounded-lg">
                <h2 className=" flex items-center gap-2 text-md font-semibold text-gray-800">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  Withdraw Funds
                </h2>
              </div>
              <div className="mr-3">
                <p className="text-xl font-bold text-blue-700 flex justify-center items-center">
                  <IndianRupeeIcon size={15} />
                  {walletAmount?.toLocaleString() || 0}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Withdrawal Form */}
            <div className="space-y-5">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    <IndianRupeeIcon size={15} />
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount (min 100)"
                    className={`w-full pl-8 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.amount
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Fee Calculation - Cleaner */}
              {amount && parseFloat(amount) >= 100 && (
                <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Request Amount:</span>
                    <span className="font-medium text-gray-800">
                      {parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Processing Fee (2%):</span>
                    <span className="text-rose-600">
                      - {withdrawalFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between font-semibold">
                    <span className="text-gray-700">You'll Receive:</span>
                    <span className="text-emerald-600">
                      {calculatedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Method - Cleaner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("bank_transfer")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      selectedMethod === "bank_transfer"
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("upi")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all opacity-60 cursor-not-allowed ${
                      selectedMethod === "upi"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600"
                    }`}
                    disabled
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">UPI</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  </button>
                </div>
              </div>

              {/* Bank Details - Clean & Simple */}
              {selectedMethod === "bank_transfer" && (
                <div className="space-y-4 border-t border-gray-100 pt-4 mt-2">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Bank Account Details
                  </h4>

                  {fetchingBank ? (
                    <div className="text-center py-6">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                      <p className="text-xs text-gray-500 mt-2">
                        Loading bank details...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={bankDetails.accountHolderName}
                          onChange={(e) =>
                            handleNameChange(
                              "accountHolderName",
                              e.target.value,
                            )
                          }
                          placeholder="Full name as per bank account"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                        />
                        {errors.accountHolderName && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.accountHolderName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            handleAccountNumberChange(e.target.value)
                          }
                          maxLength={18}
                          placeholder="Enter account number"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                        />
                        {errors.accountNumber && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.accountNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={bankDetails.ifscCode}
                          onChange={(e) => handleIfscChange(e.target.value)}
                          placeholder="e.g., SBIN0001234"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                        />
                        {errors.ifscCode && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.ifscCode}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={bankDetails.bankName}
                          onChange={(e) =>
                            handleNameChange("bankName", e.target.value)
                          }
                          placeholder="Name of the bank"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                        />
                        {errors.bankName && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.bankName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info Note - Softer */}
            <div className="mt-6 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-700 flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Withdrawals are processed within 2-3 business days. A 2%
                  processing fee applies. Minimum withdrawal amount is ₱100.
                </span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !amount ||
                parseFloat(amount) < 100 ||
                parseFloat(amount) > walletAmount
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Banknote className="w-4 h-4" />
              )}
              {loading ? "Processing..." : "Request Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
