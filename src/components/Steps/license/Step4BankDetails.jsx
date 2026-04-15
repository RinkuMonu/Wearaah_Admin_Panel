import React, { useState } from "react";
import api from "../../../serviceAuth/axios";
import { errorClass, inputClass, labelClass } from "../../../routing/constants";
// import { BASE_URL, inputClass, labelClass, errorClass } from "../constants";

const Step4 = ({ userId, token, onNext, onBack }) => {
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
    setErrors((er) => {
      const c = { ...er };
      delete c[key];
      return c;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.accountHolderName.trim())
      e.accountHolderName = "Account holder name is required";
    if (!form.accountNumber.trim())
      e.accountNumber = "Account number is required";
    else if (!/^\d{9,18}$/.test(form.accountNumber))
      e.accountNumber = "Enter a valid account number (9–18 digits)";
    if (!form.IFSC.trim()) e.IFSC = "IFSC code is required";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.IFSC))
      e.IFSC = "Invalid IFSC code (e.g. SBIN0001234)";
    if (!form.bankName.trim()) e.bankName = "Bank name is required";
    if (!form.UPI.trim()) e.UPI = "UPI ID is required";
    else if (!/^[\w.\-]+@[\w]+$/.test(form.UPI))
      e.UPI = "Invalid UPI ID (e.g. name@ybl)";
    return e;
  };

const submit = async () => {
  const e = validate();
  if (Object.keys(e).length) return setErrors(e);

  setErrors({});
  setServerError("");
  setLoading(true);

  try {
    const { data } = await api.post(`/rider/kyc/bank`, {
      userId,
      bankDetails: {
        accountHolderName: form.accountHolderName,
        accountNumber: form.accountNumber, // ✅ keep as string
        IFSC: form.IFSC.toUpperCase(),
        bankName: form.bankName,
        UPI: form.UPI,
      },
    });

    if (!data.success) {
      throw new Error(data.message || "Failed to save bank details");
    }

    onNext({});

  } catch (err) {
    setServerError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">
          Bank Details
        </h2>
        <p className="text-[#555] text-sm font-mono">
          Your earnings will be transferred here
        </p>
      </div>

      {serverError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-mono">
          {serverError}
        </div>
      )}

      <div>
        <label className={labelClass}>Account Holder Name</label>
        <input
          className={inputClass}
          placeholder="e.g. Rahul Sharma"
          value={form.accountHolderName}
          onChange={set("accountHolderName")}
        />
        {errors.accountHolderName && (
          <p className={errorClass}>{errors.accountHolderName}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Account Number</label>
        <input
          className={inputClass}
          placeholder="e.g. 898989898989"
          value={form.accountNumber}
          maxLength={18}
          onChange={(e) => {
            setForm((f) => ({
              ...f,
              accountNumber: e.target.value.replace(/\D/g, ""),
            }));
            setErrors((er) => {
              const c = { ...er };
              delete c.accountNumber;
              return c;
            });
          }}
        />
        {errors.accountNumber && (
          <p className={errorClass}>{errors.accountNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>IFSC Code</label>
          <input
            className={`${inputClass} uppercase`}
            placeholder="e.g. SBIN0001234"
            value={form.IFSC}
            onChange={(e) => {
              setForm((f) => ({ ...f, IFSC: e.target.value.toUpperCase() }));
              setErrors((er) => {
                const c = { ...er };
                delete c.IFSC;
                return c;
              });
            }}
          />
          {errors.IFSC && <p className={errorClass}>{errors.IFSC}</p>}
        </div>
        <div>
          <label className={labelClass}>Bank Name</label>
          <input
            className={inputClass}
            placeholder="e.g. SBI Jaipur"
            value={form.bankName}
            onChange={set("bankName")}
          />
          {errors.bankName && <p className={errorClass}>{errors.bankName}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>UPI ID</label>
        <input
          className={inputClass}
          placeholder="e.g. name@ybl"
          value={form.UPI}
          onChange={set("UPI")}
        />
        {errors.UPI && <p className={errorClass}>{errors.UPI}</p>}
      </div>

      <div className="flex gap-3 pt-1">
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

export default Step4;