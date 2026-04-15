import React, { useState } from "react";
import api from "../../serviceAuth/axios";
import { errorClass, inputClass, labelClass } from "../../routing/constants";
// import { BASE_URL, inputClass, labelClass, errorClass } from "../constants";

const vehicleTypes = ["bike", "scooter", "car", "auto", "van"];

const Step2 = ({ userId, token, onNext, onBack }) => {
  const [form, setForm] = useState({
    city: "",
    vehicleType: "",
    vehicleNumber: "",
    drivingLicenseNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => {
      const c = { ...er };
      delete c[key];
      return c;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.city.trim()) e.city = "City is required";
    if (!form.vehicleType) e.vehicleType = "Vehicle type is required";
    if (!form.vehicleNumber.trim())
      e.vehicleNumber = "Vehicle number is required";
    else if (
      !/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/i.test(
        form.vehicleNumber.replace(/\s/g, "")
      )
    )
      e.vehicleNumber = "Invalid vehicle number (e.g. RJ45AB1234)";
    if (!form.drivingLicenseNumber.trim())
      e.drivingLicenseNumber = "Driving license number is required";
    return e;
  };

const submit = async () => {
  const e = validate();
  if (Object.keys(e).length) return setErrors(e);

  setErrors({});
  setServerError("");
  setLoading(true);

  try {
    const res = await api.post(
      `/rider/kyc/basic`,
      {
        userId,
        city: form.city,
        vehicleType: form.vehicleType,
        vehicleNumber: form.vehicleNumber,
        drivingLicenseNumber: form.drivingLicenseNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 REQUIRED FIX
        },
      }
    );

    const data = res.data;

    if (!data) {
      throw new Error("Failed to save basic info");
    }

    // pass response forward (better than just form)
    onNext(data);

  } catch (err) {
    setServerError(
      err.response?.data?.message || err.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">
          Basic Information
        </h2>
        <p className="text-[#555] text-sm font-mono">
          Tell us about your vehicle and license
        </p>
      </div>

      {serverError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          {serverError}
        </div>
      )}

      <div>
        <label className={labelClass}>City</label>
        <input
          className={inputClass}
          placeholder="e.g. Jaipur"
          value={form.city}
          onChange={set("city")}
        />
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
        {errors.vehicleType && (
          <p className={errorClass}>{errors.vehicleType}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Vehicle Number</label>
        <input
          className={`${inputClass} uppercase`}
          placeholder="e.g. RJ45AB1234"
          value={form.vehicleNumber}
          onChange={(e) => {
            setForm((f) => ({
              ...f,
              vehicleNumber: e.target.value.toUpperCase(),
            }));
            setErrors((er) => {
              const c = { ...er };
              delete c.vehicleNumber;
              return c;
            });
          }}
        />
        {errors.vehicleNumber && (
          <p className={errorClass}>{errors.vehicleNumber}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Driving License Number</label>
        <input
          className={`${inputClass} uppercase`}
          placeholder="e.g. RJ45 20250012345"
          value={form.drivingLicenseNumber}
          onChange={(e) => {
            setForm((f) => ({
              ...f,
              drivingLicenseNumber: e.target.value.toUpperCase(),
            }));
            setErrors((er) => {
              const c = { ...er };
              delete c.drivingLicenseNumber;
              return c;
            });
          }}
        />
        {errors.drivingLicenseNumber && (
          <p className={errorClass}>{errors.drivingLicenseNumber}</p>
        )}
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
};

export default Step2;