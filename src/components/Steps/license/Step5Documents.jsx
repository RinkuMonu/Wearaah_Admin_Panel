import React, { useState } from "react";
import api from "../../../serviceAuth/axios";
import { errorClass, labelClass } from "../../../routing/constants";
// import { BASE_URL, labelClass, errorClass } from "../constants";

const DOCS = [
  {
    key: "rcDocument",
    label: "RC Document",
    accept: "image/*,.pdf",
    hint: "Vehicle Registration Certificate",
  },
  {
    key: "licenseDocument",
    label: "License Document",
    accept: "image/*,.pdf",
    hint: "Driving License (front & back)",
  },
  {
    key: "aadharDocument",
    label: "Aadhaar Document",
    accept: "image/*,.pdf",
    hint: "Aadhaar card (front & back)",
  },
];

const Step5 = ({ userId, token, onNext, onBack }) => {
  const [files, setFiles] = useState({
    rcDocument: null,
    licenseDocument: null,
    aadharDocument: null,
  });
  const [previews, setPreviews] = useState({
    rcDocument: null,
    licenseDocument: null,
    aadharDocument: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleFile = (key) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles((f) => ({ ...f, [key]: file }));
    setErrors((er) => {
      const c = { ...er };
      delete c[key];
      return c;
    });
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPreviews((p) => ({
          ...p,
          [key]: { type: "image", src: ev.target.result },
        }));
      reader.readAsDataURL(file);
    } else {
      setPreviews((p) => ({ ...p, [key]: { type: "pdf", name: file.name } }));
    }
  };

  const validate = () => {
    const e = {};
    DOCS.forEach(({ key, label }) => {
      if (!files[key]) e[key] = `${label} is required`;
    });
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

    const { data } = await api.post(
      `/rider/kyc/documents`,
      formData, // ✅ directly pass formData
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to upload documents");
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
          Upload Documents
        </h2>
        <p className="text-[#555] text-sm font-mono">
          Upload images or PDFs of your documents
        </p>
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
                  <img
                    src={previews[key].src}
                    alt={label}
                    className="h-14 w-14 object-cover rounded-lg border border-[#2a2a2a]"
                  />
                ) : (
                  <div className="h-14 w-14 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] text-2xl">
                    📄
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[#e8c547] text-xs font-mono font-semibold truncate">
                    {files[key].name}
                  </p>
                  <p className="text-[#555] text-xs font-mono">
                    {(files[key].size / 1024).toFixed(1)} KB — tap to change
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-5 flex flex-col items-center gap-1">
                <span className="text-2xl">⬆️</span>
                <p className="text-[#555] text-xs font-mono">{hint}</p>
                <p className="text-[#333] text-[10px] font-mono">
                  JPG, PNG or PDF
                </p>
              </div>
            )}
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFile(key)}
            />
          </label>
          {errors[key] && <p className={errorClass}>{errors[key]}</p>}
        </div>
      ))}

      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 border cursor-pointer border-[#2a2a2a] hover:border-[#444] text-[#888] font-mono py-3.5 rounded-xl transition-all text-sm"
        >
          ← Back
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-[2] bg-[#e8c547] cursor-pointer hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
        >
          {loading ? "Uploading..." : "Submit & Finish →"}
        </button>
      </div>
    </div>
  );
};

export default Step5;