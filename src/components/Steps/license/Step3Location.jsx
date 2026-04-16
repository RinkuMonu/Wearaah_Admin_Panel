import React, { useState } from "react";
import api from "../../../serviceAuth/axios";
import { errorClass, inputClass, labelClass } from "../../../routing/constants";
// import { BASE_URL, inputClass, labelClass, errorClass } from "../constants";

const Step3 = ({ userId, token, onNext, onBack }) => {
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [detecting, setDetecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const detect = () => {
    if (!navigator.geolocation)
      return setServerError("Geolocation not supported by your browser");
    setDetecting(true);
    setServerError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        });
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
    else if (isNaN(coords.lat) || coords.lat < -90 || coords.lat > 90)
      e.lat = "Invalid latitude";
    if (!coords.lng) e.lng = "Longitude is required";
    else if (isNaN(coords.lng) || coords.lng < -180 || coords.lng > 180)
      e.lng = "Invalid longitude";
    return e;
  };

const submit = async () => {
  const e = validate();
  if (Object.keys(e).length) return setErrors(e);

  setErrors({});
  setServerError("");
  setLoading(true);

  try {
    const { data } = await api.post(`/rider/kyc/location`, {
      userId,
      geoLocation: {
        lat: Number(coords.lat),
        lng: Number(coords.lng),
      },
    });

    if (!data.success) {
      throw new Error(data.message || "Failed to save location");
    }

    onNext({ geoLocation: coords });

  } catch (err) {
    setServerError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">
          Your Location
        </h2>
        <p className="text-[#555] text-sm font-mono">
          Set your base operating location
        </p>
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
            onChange={(e) => {
              setCoords((c) => ({ ...c, lat: e.target.value }));
              setErrors((er) => {
                const c = { ...er };
                delete c.lat;
                return c;
              });
            }}
          />
          {errors.lat && <p className={errorClass}>{errors.lat}</p>}
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input
            className={inputClass}
            placeholder="75.7873"
            value={coords.lng}
            onChange={(e) => {
              setCoords((c) => ({ ...c, lng: e.target.value }));
              setErrors((er) => {
                const c = { ...er };
                delete c.lng;
                return c;
              });
            }}
          />
          {errors.lng && <p className={errorClass}>{errors.lng}</p>}
        </div>
      </div>

      {coords.lat && coords.lng && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 font-mono text-xs text-[#888] flex items-center gap-3">
          <span className="text-xl">🗺️</span>
          <div>
            <p className="text-[#e8c547]">Location captured</p>
            <p>
              {coords.lat}° N, {coords.lng}° E
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border cursor-pointer border-[#2a2a2a] hover:border-[#444] text-[#888] font-mono py-3.5 rounded-xl transition-all text-sm"
        >
          ← Back
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="flex-[2] cursor-pointer bg-[#e8c547] hover:bg-[#f0d060] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3.5 rounded-xl transition-all duration-200 font-mono text-sm tracking-wide"
        >
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  );
};

export default Step3;