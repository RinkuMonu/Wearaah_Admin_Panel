import React, { useState } from "react";

const BASE_URL = "http://localhost:5000/api";

const STEPS = [
  { id: 1, label: "Verification", icon: "🛡️" },
  { id: 2, label: "Basic Info", icon: "📋" },
  { id: 3, label: "Location", icon: "📍" },
  { id: 4, label: "Documents", icon: "📄" },
  { id: 5, label: "Review", icon: "✅" },
];

const inputClass =
  "w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f0ede8] placeholder-[#444] focus:outline-none focus:border-[#e8c547] transition-colors text-sm font-mono";
const labelClass = "block text-[#888] text-xs font-semibold uppercase tracking-widest mb-2";
const errorClass = "text-red-400 text-xs mt-1 font-mono";

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step.id < current
                  ? "bg-[#e8c547] border-[#e8c547] text-[#0a0a0a]"
                  : step.id === current
                  ? "bg-[#0a0a0a] border-[#e8c547] text-[#e8c547]"
                  : "bg-[#0a0a0a] border-[#2a2a2a] text-[#444]"
              }`}
            >
              {step.id < current ? "✓" : step.id}
            </div>
            <span
              className={`text-[10px] font-mono tracking-wide ${
                step.id === current ? "text-[#e8c547]" : step.id < current ? "text-[#888]" : "text-[#333]"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-10 h-[2px] mb-4 transition-all duration-300 ${
                step.id < current ? "bg-[#e8c547]" : "bg-[#2a2a2a]"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── STEP 1: OTP Verification ───────────────────────────────────────────────
function Step1({ onNext }) {
  const [phase, setPhase] = useState("form"); // form | otp
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => { const c = { ...er }; delete c[key]; return c; });
  };

  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.mobile) e.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    return e;
  };

  const validateOtp = () => {
    const e = {};
    if (!otp) e.otp = "OTP is required";
    else if (!/^\d{6}$/.test(otp)) e.otp = "OTP must be 6 digits";
    return e;
  };

  const sendOtp = async () => {
    const e = validateForm();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: form.mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setPhase("otp");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const e = validateOtp();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register/via/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: form.mobile, otp: Number(otp) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      const accessToken = data.token || data.accessToken || data.data?.token;
      const id = data.userId || data.data?.userId || data.data?._id;
      onNext({ userId: id, token: accessToken });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">Identity Verification</h2>
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
          {/* Name */}
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

          {/* Email */}
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

          {/* Mobile */}
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
                  setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, "") }));
                  setErrors((er) => { const c = { ...er }; delete c.mobile; return c; });
                }}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
            </div>
            {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
          </div>

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
          >
            {loading ? "Sending OTP..." : "Send OTP →"}
          </button>
        </>
      ) : (
        <>
          {/* Summary of entered details */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 space-y-1">
            <p className="text-[#888] text-xs font-mono">
              <span className="text-[#555]">Name: </span>{form.name}
            </p>
            <p className="text-[#888] text-xs font-mono">
              <span className="text-[#555]">Email: </span>{form.email}
            </p>
            <p className="text-[#888] text-xs font-mono">
              <span className="text-[#555]">Mobile: </span>+91 {form.mobile}
            </p>
          </div>

          {/* OTP input */}
          <div>
            <label className={labelClass}>Enter OTP</label>
            <input
              className={`${inputClass} tracking-[0.5em] text-center text-lg`}
              placeholder="• • • • • •"
              value={otp}
              maxLength={6}
              autoFocus
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setErrors({}); }}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
            />
            {errors.otp && <p className={errorClass}>{errors.otp}</p>}
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => { setPhase("form"); setOtp(""); setErrors({}); setServerError(""); }}
                className="text-[#e8c547] text-xs font-mono hover:underline"
              >
                ← Edit details
              </button>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="text-[#555] hover:text-[#888] text-xs font-mono transition-colors disabled:opacity-40"
              >
                Resend OTP
              </button>
            </div>
          </div>

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
          >
            {loading ? "Verifying..." : "Verify OTP & Continue →"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── STEP 2: Basic Info ──────────────────────────────────────────────────────
function Step2({ userId, token, onNext, onBack }) {
  const [form, setForm] = useState({
    city: "",
    vehicleType: "",
    vehicleNumber: "",
    drivingLicenseNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const vehicleTypes = ["bike", "scooter", "car", "auto", "van"];

  const validate = () => {
    const e = {};
    if (!form.city.trim()) e.city = "City is required";
    if (!form.vehicleType) e.vehicleType = "Vehicle type is required";
    if (!form.vehicleNumber.trim()) e.vehicleNumber = "Vehicle number is required";
    else if (!/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/i.test(form.vehicleNumber.replace(/\s/g, "")))
      e.vehicleNumber = "Invalid vehicle number (e.g. RJ45AB1234)";
    if (!form.drivingLicenseNumber.trim()) e.drivingLicenseNumber = "Driving license number is required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/rider/kyc/basic`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save basic info");
      onNext({ ...form });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => { const c = { ...er }; delete c[key]; return c; });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">Basic Information</h2>
        <p className="text-[#555] text-sm font-mono">Tell us about your vehicle and license</p>
      </div>

      {serverError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          {serverError}
        </div>
      )}

      <div>
        <label className={labelClass}>City</label>
        <input className={inputClass} placeholder="e.g. Jaipur" value={form.city} onChange={set("city")} />
        {errors.city && <p className={errorClass}>{errors.city}</p>}
      </div>

      <div>
        <label className={labelClass}>Vehicle Type</label>
        <select
          className={`${inputClass} appearance-none cursor-pointer`}
          value={form.vehicleType}
          onChange={set("vehicleType")}
        >
          <option value="">Select vehicle type</option>
          {vehicleTypes.map((v) => (
            <option key={v} value={v} className="capitalize">
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </option>
          ))}
        </select>
        {errors.vehicleType && <p className={errorClass}>{errors.vehicleType}</p>}
      </div>

      <div>
        <label className={labelClass}>Vehicle Number</label>
        <input
          className={`${inputClass} uppercase`}
          placeholder="e.g. RJ45AB1234"
          value={form.vehicleNumber}
          onChange={(e) => { setForm(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() })); setErrors(er => { const c = { ...er }; delete c.vehicleNumber; return c; }); }}
        />
        {errors.vehicleNumber && <p className={errorClass}>{errors.vehicleNumber}</p>}
      </div>

      <div>
        <label className={labelClass}>Driving License Number</label>
        <input
          className={`${inputClass} uppercase`}
          placeholder="e.g. RJ45 20250012345"
          value={form.drivingLicenseNumber}
          onChange={(e) => { setForm(f => ({ ...f, drivingLicenseNumber: e.target.value.toUpperCase() })); setErrors(er => { const c = { ...er }; delete c.drivingLicenseNumber; return c; }); }}
        />
        {errors.drivingLicenseNumber && <p className={errorClass}>{errors.drivingLicenseNumber}</p>}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-[#2a2a2a] hover:border-[#444] text-[#888] font-mono py-3.5 rounded-xl transition-all text-sm"
        >
          ← Back
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-[2] bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
        >
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── STEP 3: Location ────────────────────────────────────────────────────────
function Step3({ userId, token, onNext, onBack }) {
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [detecting, setDetecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const detect = () => {
    if (!navigator.geolocation) return setServerError("Geolocation not supported by your browser");
    setDetecting(true);
    setServerError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) });
        setDetecting(false);
        setErrors({});
      },
      () => {
        setServerError("Could not detect location. Please enter manually.");
        setDetecting(false);
      }
    );
  };

  const validate = () => {
    const e = {};
    if (!coords.lat) e.lat = "Latitude is required";
    else if (isNaN(coords.lat) || coords.lat < -90 || coords.lat > 90) e.lat = "Invalid latitude";
    if (!coords.lng) e.lng = "Longitude is required";
    else if (isNaN(coords.lng) || coords.lng < -180 || coords.lng > 180) e.lng = "Invalid longitude";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/rider/kyc/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, geoLocation: { lat: Number(coords.lat), lng: Number(coords.lng) } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save location");
      onNext({ geoLocation: coords });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">Your Location</h2>
        <p className="text-[#555] text-sm font-mono">Set your base operating location</p>
      </div>

      {serverError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          {serverError}
        </div>
      )}

      <button
        onClick={detect}
        disabled={detecting}
        className="w-full border border-dashed border-[#e8c547]/40 hover:border-[#e8c547] bg-[#e8c547]/5 hover:bg-[#e8c547]/10 rounded-xl py-4 text-[#e8c547] font-mono text-sm transition-all flex items-center justify-center gap-2"
      >
        {detecting ? (
          <>
            <span className="animate-spin">⟳</span> Detecting location...
          </>
        ) : (
          <>📍 Auto-detect my location</>
        )}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2a2a2a]" />
        <span className="text-[#444] text-xs font-mono">or enter manually</span>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Latitude</label>
          <input
            className={inputClass}
            placeholder="26.9124"
            value={coords.lat}
            onChange={(e) => { setCoords(c => ({ ...c, lat: e.target.value })); setErrors(er => { const c = { ...er }; delete c.lat; return c; }); }}
          />
          {errors.lat && <p className={errorClass}>{errors.lat}</p>}
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input
            className={inputClass}
            placeholder="75.7873"
            value={coords.lng}
            onChange={(e) => { setCoords(c => ({ ...c, lng: e.target.value })); setErrors(er => { const c = { ...er }; delete c.lng; return c; }); }}
          />
          {errors.lng && <p className={errorClass}>{errors.lng}</p>}
        </div>
      </div>

      {coords.lat && coords.lng && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 font-mono text-xs text-[#888] flex items-center gap-3">
          <span className="text-xl">🗺️</span>
          <div>
            <p className="text-[#e8c547]">Location captured</p>
            <p>{coords.lat}° N, {coords.lng}° E</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-[#2a2a2a] hover:border-[#444] text-[#888] font-mono py-3.5 rounded-xl transition-all text-sm"
        >
          ← Back
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-[2] bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
        >
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── STEP 4: Bank Details ────────────────────────────────────────────────────
function Step4({ userId, token, onNext, onBack }) {
  const [form, setForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    IFSC: "",
    bankName: "",
    UPI: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => { const c = { ...er }; delete c[key]; return c; });
  };

  const validate = () => {
    const e = {};
    if (!form.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
    if (!form.accountNumber.trim()) e.accountNumber = "Account number is required";
    else if (!/^\d{9,18}$/.test(form.accountNumber)) e.accountNumber = "Enter a valid account number (9–18 digits)";
    if (!form.IFSC.trim()) e.IFSC = "IFSC code is required";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.IFSC)) e.IFSC = "Invalid IFSC code (e.g. SBIN0001234)";
    if (!form.bankName.trim()) e.bankName = "Bank name is required";
    if (!form.UPI.trim()) e.UPI = "UPI ID is required";
    else if (!/^[\w.\-]+@[\w]+$/.test(form.UPI)) e.UPI = "Invalid UPI ID (e.g. name@ybl)";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/rider/kyc/bank`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userId,
          bankDetails: {
            accountHolderName: form.accountHolderName,
            accountNumber: Number(form.accountNumber),
            IFSC: form.IFSC.toUpperCase(),
            bankName: form.bankName,
            UPI: form.UPI,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save bank details");
      onNext({});
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">Bank Details</h2>
        <p className="text-[#555] text-sm font-mono">Your earnings will be transferred here</p>
      </div>

      {serverError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          {serverError}
        </div>
      )}

      <div>
        <label className={labelClass}>Account Holder Name</label>
        <input className={inputClass} placeholder="e.g. Rahul Sharma" value={form.accountHolderName} onChange={set("accountHolderName")} />
        {errors.accountHolderName && <p className={errorClass}>{errors.accountHolderName}</p>}
      </div>

      <div>
        <label className={labelClass}>Account Number</label>
        <input
          className={inputClass}
          placeholder="e.g. 898989898989"
          value={form.accountNumber}
          maxLength={18}
          onChange={(e) => { setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, "") })); setErrors(er => { const c = { ...er }; delete c.accountNumber; return c; }); }}
        />
        {errors.accountNumber && <p className={errorClass}>{errors.accountNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>IFSC Code</label>
          <input
            className={`${inputClass} uppercase`}
            placeholder="e.g. SBIN0001234"
            value={form.IFSC}
            onChange={(e) => { setForm(f => ({ ...f, IFSC: e.target.value.toUpperCase() })); setErrors(er => { const c = { ...er }; delete c.IFSC; return c; }); }}
          />
          {errors.IFSC && <p className={errorClass}>{errors.IFSC}</p>}
        </div>
        <div>
          <label className={labelClass}>Bank Name</label>
          <input className={inputClass} placeholder="e.g. SBI Jaipur" value={form.bankName} onChange={set("bankName")} />
          {errors.bankName && <p className={errorClass}>{errors.bankName}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>UPI ID</label>
        <input className={inputClass} placeholder="e.g. name@ybl" value={form.UPI} onChange={set("UPI")} />
        {errors.UPI && <p className={errorClass}>{errors.UPI}</p>}
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="flex-1 border border-[#2a2a2a] hover:border-[#444] text-[#888] font-mono py-3.5 rounded-xl transition-all text-sm">
          ← Back
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-[2] bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
        >
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── STEP 5: Documents Upload ─────────────────────────────────────────────────
function Step5({ userId, token, onNext, onBack }) {
  const [files, setFiles] = useState({ rcDocument: null, licenseDocument: null, aadharDocument: null });
  const [previews, setPreviews] = useState({ rcDocument: null, licenseDocument: null, aadharDocument: null });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const DOCS = [
    { key: "rcDocument", label: "RC Document", accept: "image/*,.pdf", hint: "Vehicle Registration Certificate" },
    { key: "licenseDocument", label: "License Document", accept: "image/*,.pdf", hint: "Driving License (front & back)" },
    { key: "aadharDocument", label: "Aadhaar Document", accept: "image/*,.pdf", hint: "Aadhaar card (front & back)" },
  ];

  const handleFile = (key) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles((f) => ({ ...f, [key]: file }));
    setErrors((er) => { const c = { ...er }; delete c[key]; return c; });
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => ({ ...p, [key]: { type: "image", src: ev.target.result } }));
      reader.readAsDataURL(file);
    } else {
      setPreviews((p) => ({ ...p, [key]: { type: "pdf", name: file.name } }));
    }
  };

  const validate = () => {
    const e = {};
    DOCS.forEach(({ key, label }) => { if (!files[key]) e[key] = `${label} is required`; });
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("rcDocument", files.rcDocument);
      formData.append("licenseDocument", files.licenseDocument);
      formData.append("aadharDocument", files.aadharDocument);
      const res = await fetch(`${BASE_URL}/rider/kyc/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload documents");
      onNext({});
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">Upload Documents</h2>
        <p className="text-[#555] text-sm font-mono">Upload images or PDFs of your documents</p>
      </div>

      {serverError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          {serverError}
        </div>
      )}

      {DOCS.map(({ key, label, accept, hint }) => (
        <div key={key}>
          <label className={labelClass}>{label}</label>
          <label
            className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
              files[key]
                ? "border-[#e8c547]/50 bg-[#e8c547]/5"
                : errors[key]
                ? "border-red-500/40 bg-red-900/5"
                : "border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#444] hover:bg-[#1a1a1a]"
            }`}
            style={{ minHeight: "80px" }}
          >
            {previews[key] ? (
              <div className="w-full p-3 flex items-center gap-3">
                {previews[key].type === "image" ? (
                  <img src={previews[key].src} alt={label} className="h-14 w-14 object-cover rounded-lg border border-[#2a2a2a]" />
                ) : (
                  <div className="h-14 w-14 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] text-2xl">📄</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[#e8c547] text-xs font-mono font-semibold truncate">{files[key].name}</p>
                  <p className="text-[#555] text-xs font-mono">{(files[key].size / 1024).toFixed(1)} KB — tap to change</p>
                </div>
              </div>
            ) : (
              <div className="py-5 flex flex-col items-center gap-1">
                <span className="text-2xl">⬆️</span>
                <p className="text-[#555] text-xs font-mono">{hint}</p>
                <p className="text-[#333] text-[10px] font-mono">JPG, PNG or PDF</p>
              </div>
            )}
            <input type="file" accept={accept} className="hidden" onChange={handleFile(key)} />
          </label>
          {errors[key] && <p className={errorClass}>{errors[key]}</p>}
        </div>
      ))}

      <div className="flex gap-3 pt-1">
        <button onClick={onBack} className="flex-1 border border-[#2a2a2a] hover:border-[#444] text-[#888] font-mono py-3.5 rounded-xl transition-all text-sm">
          ← Back
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-[2] bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
        >
          {loading ? "Uploading..." : "Submit & Finish →"}
        </button>
      </div>
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="text-5xl mb-2">🎉</div>
      <h2 className="text-2xl font-bold text-[#f0ede8] font-mono">Registration Complete!</h2>
      <p className="text-[#555] text-sm font-mono">Your KYC has been submitted. Our team will review and activate your account shortly.</p>
      <div className="bg-[#e8c547]/10 border border-[#e8c547]/20 rounded-xl px-4 py-3 text-[#e8c547] text-xs font-mono">
        You'll receive a confirmation on your registered mobile number.
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ──────────────────────────────────────────────────────────
const RiderDetails = () => {
  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState({ userId: null, token: null });
  const [done, setDone] = useState(false);

  const next = (data = {}) => {
    setMeta((m) => ({ ...m, ...data }));
    if (step === 5) { setDone(true); return; }
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: "#0a0a0a",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(232,197,71,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(232,197,71,0.03) 0%, transparent 50%)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        select option { background: #1a1a1a; color: #f0ede8; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e8c547]/10 border border-[#e8c547]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#e8c547] rounded-full animate-pulse" />
            <span className="text-[#e8c547] text-xs font-mono tracking-widest uppercase">Rider Onboarding</span>
          </div>
          <h1 className="text-3xl font-bold text-[#f0ede8]" style={{ letterSpacing: "-0.02em" }}>
            Join as a Rider
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, #141414 0%, #111 100%)",
            border: "1px solid #1e1e1e",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {done ? (
            <SuccessScreen />
          ) : (
            <>
              <StepIndicator current={step} />
              {step === 1 && <Step1 onNext={next} />}
              {step === 2 && <Step2 userId={meta.userId} token={meta.token} onNext={next} onBack={back} />}
              {step === 3 && <Step3 userId={meta.userId} token={meta.token} onNext={next} onBack={back} />}
              {step === 4 && <Step4 userId={meta.userId} token={meta.token} onNext={next} onBack={back} />}
              {step === 5 && <Step5 userId={meta.userId} token={meta.token} onNext={next} onBack={back} />}
            </>
          )}
        </div>

        {!done && (
          <p className="text-center text-[#333] text-xs font-mono mt-6">
            Step {step} of {STEPS.length} — {STEPS[step - 1]?.label}
          </p>
        )}
      </div>
    </div>
  );
};

export default RiderDetails;