// steps/Step1Verification.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../serviceAuth/axios";

export default function Step1Verification({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateBasic = () => {
    const { name, email, mobile } = form;

    if (!name || !email || !mobile) {
      Swal.fire("Error", "All fields required", "warning");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Swal.fire("Error", "Invalid mobile", "warning");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire("Error", "Invalid email", "warning");
      return false;
    }

    return true;
  };

  // 🔥 SEND OTP
  const handleSendOtp = async () => {
    if (!validateBasic()) return;

    try {
      setLoading(true);

      await api.post("otp/send", form);
      // 👉 backend OTP send karega

      Swal.fire("Success", "OTP sent successfully", "success");

      setOtpSent(true);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to send OTP",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!form.otp) {
      return Swal.fire("Error", "Enter OTP", "warning");
    }

    try {
      setLoading(true);

      const res = await api.post("seller/verification", {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        otp: form.otp,
      });

      const { token, user, step, message } = res.data;

      // 🔥 save token
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user._id);

      Swal.fire("Success", message, "success");

      onSuccess(step);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          {!otpSent ? "Account Verification" : "Verify Your Identity"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {!otpSent
            ? "Enter your details to get started"
            : "We've sent a 6-digit OTP to your mobile number"}
        </p>
      </div>

      {/* BASIC FIELDS */}
      {!otpSent && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              name="email"
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
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
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      )}

      {/* OTP FIELD */}
      {otpSent && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h8z"
                />
              </svg>
            </div>
            <input
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={handleChange}
              maxLength="6"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none text-center text-lg tracking-widest"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setOtpSent(false);
                setForm({ ...form, otp: "" });
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
            >
              Edit Details
            </button>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Verifying...
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleSendOtp}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        </div>
      )}

      {/* INFO NOTE */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-gray-400 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-gray-500">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            We'll send important account notifications to your email and mobile.
          </p>
        </div>
      </div>
    </div>
  );
}
