import React, { useState } from "react";
import api from "../../serviceAuth/axios";
import { errorClass, inputClass, labelClass } from "../../routing/constants";

const Step1 = ({ onNext }) => {
  const [phase, setPhase] = useState("form"); // "form" | "otp"
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => {
      const c = { ...er };
      delete c[key];
      return c;
    });
  };

  // ---------------- VALIDATIONS ----------------
  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";

    if (!form.mobile) e.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile))
      e.mobile = "Enter a valid 10-digit mobile number";

    return e;
  };

  const validateOtp = () => {
    const e = {};
    if (!otp) e.otp = "OTP is required";
    else if (!/^\d{6}$/.test(otp)) e.otp = "OTP must be 6 digits";
    return e;
  };

  // ---------------- SEND OTP ----------------
  const sendOtp = async () => {
    const e = validateForm();
    if (Object.keys(e).length) return setErrors(e);

    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      await api.post(`/otp/send`, {
        mobile: form.mobile,
      });

      setPhase("otp");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VERIFY OTP + KYC ----------------
  const verifyOtp = async () => {
    const e = validateOtp();
    if (Object.keys(e).length) return setErrors(e);

    setErrors({});
    setServerError("");
    setLoading(true);

    try {
 // 2️⃣ Call KYC API
      const kycRes = await api.post(
        `/rider/kyc/verification`,
        {
          name: form.name,
          email: form.email,
          mobile: Number(form.mobile),
          otp: Number(otp),
        },
       
      );
        const data = kycRes.data;
        const resumeStep = data.step || data.data?.step || 2;

      const userId =
      data.user._id|| data.data?.userId || data.data?._id;
       if (!userId) throw new Error("User ID not received");
      // 3️⃣ Move to next step
      onNext({
        userId,
        kyc: kycRes.data,
        resumeStep 
      });

    } catch (err) {
      setServerError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">
          Identity Verification
        </h2>
        <p className="text-[#555] text-sm font-mono">
          {phase === "form"
            ? "Fill in your details to get started"
            : `OTP sent to +91 ${form.mobile} — enter it below`}
        </p>
      </div>

      {serverError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          {serverError}
        </div>
      )}

      {phase === "form" ? (
        <>
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              className={inputClass}
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={setField("name")}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              className={inputClass}
              type="email"
              placeholder="e.g. rahul@gmail.com"
              value={form.email}
              onChange={setField("email")}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass}>Mobile Number</label>
            <div className="flex">
              <span className="bg-[#1a1a1a] border border-r-0 border-[#2a2a2a] rounded-l-xl px-3 flex items-center text-[#555] text-sm font-mono">
                +91
              </span>
              <input
                className={`${inputClass} rounded-l-none`}
                placeholder="9876543210"
                value={form.mobile}
                maxLength={10}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    mobile: e.target.value.replace(/\D/g, ""),
                  }));
                  setErrors((er) => {
                    const c = { ...er };
                    delete c.mobile;
                    return c;
                  });
                }}
              />
            </div>
            {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
          </div>

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 text-[#0a0a0a] font-bold py-3.5 rounded-xl font-mono cursor-pointer"
          >
            {loading ? "Sending OTP..." : "Send OTP →"}
          </button>
        </>
      ) : (
        <>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 space-y-1">
            <p className="text-[#888] text-xs font-mono">
              Name: {form.name}
            </p>
            <p className="text-[#888] text-xs font-mono">
              Email: {form.email}
            </p>
            <p className="text-[#888] text-xs font-mono">
              Mobile: +91 {form.mobile}
            </p>
          </div>

          <div>
            <label className={labelClass}>Enter OTP</label>
            <input
              className={`${inputClass} tracking-[0.5em] text-center text-lg`}
              placeholder="• • • • • •"
              value={otp}
              maxLength={6}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setErrors({});
              }}
            />
            {errors.otp && <p className={errorClass}>{errors.otp}</p>}
          </div>

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 text-[#0a0a0a] font-bold py-3.5 rounded-xl font-mono cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP & Continue →"}
          </button>
        </>
      )}
    </div>
  );
};

export default Step1;