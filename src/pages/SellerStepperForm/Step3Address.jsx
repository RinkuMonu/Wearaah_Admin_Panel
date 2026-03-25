// steps/Step3Address.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../serviceAuth/axios";
import {
  MapPin,
  Building2,
  Landmark,
  Mailbox,
  Navigation,
  LocateFixed,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";

export default function Step3Address({ onSuccess }) {
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [locationError, setLocationError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 GET LOCATION
  const getLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation not supported", "error");
      return;
    }

    setLocLoading(true);
    setLocationError(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords([lng, lat]); // 🔥 IMPORTANT FORMAT

        Swal.fire("Success", "Location captured successfully", "success");
        setLocLoading(false);
      },
      (error) => {
        let errorMessage = "Please enable location access";
        if (error.code === 1) {
          errorMessage = "Location permission denied. Please allow access to capture your location.";
        } else if (error.code === 2) {
          errorMessage = "Location unavailable. Please try again.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please try again.";
        }
        Swal.fire("Error", errorMessage, "error");
        setLocationError(true);
        setLocLoading(false);
      },
    );
  };

  const validate = () => {
    const { street, city, state, pincode } = form;

    if (!street || !city || !state || !pincode) {
      Swal.fire("Error", "All address fields are required", "warning");
      return false;
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      Swal.fire("Error", "Please enter a valid 6-digit pincode", "warning");
      return false;
    }

    if (!coords) {
      Swal.fire("Error", "Please capture your location", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        pickupDelivery: form,
        geoLocation: {
          coordinates: coords, // [lng, lat]
        },
      };

      await api.post("/seller/address", payload);

      Swal.fire("Success", "Address saved successfully", "success");

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
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Pickup Location
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Enter your business address where items will be picked up
        </p>
      </div>

      {/* ADDRESS FIELDS */}
      <div className="space-y-4">
        {/* Street */}
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "street" ? "text-gray-900" : "text-gray-400"
          }`}>
            <Building2 className="h-5 w-5" />
          </div>
          <input
            name="street"
            placeholder="Street Address"
            value={form.street}
            onChange={handleChange}
            onFocus={() => setFocusedField("street")}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        {/* City */}
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "city" ? "text-gray-900" : "text-gray-400"
          }`}>
            <Building2 className="h-5 w-5" />
          </div>
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            onFocus={() => setFocusedField("city")}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        {/* State */}
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "state" ? "text-gray-900" : "text-gray-400"
          }`}>
            <Landmark className="h-5 w-5" />
          </div>
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            onFocus={() => setFocusedField("state")}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        {/* Pincode */}
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            focusedField === "pincode" ? "text-gray-900" : "text-gray-400"
          }`}>
            <Mailbox className="h-5 w-5" />
          </div>
          <input
            name="pincode"
            placeholder="Pincode (6 digits)"
            value={form.pincode}
            onChange={handleChange}
            onFocus={() => setFocusedField("pincode")}
            onBlur={() => setFocusedField(null)}
            maxLength="6"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>
      </div>

      {/* LOCATION BUTTON */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={getLocation}
          disabled={locLoading}
          className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 border border-gray-300"
        >
          {locLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Fetching location...
            </>
          ) : (
            <>
              <LocateFixed className="h-5 w-5" />
              Get Current Location
            </>
          )}
        </button>

        {/* LOCATION STATUS */}
        {coords && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Location Captured</p>
                <p className="text-xs text-green-600 mt-1">
                  Latitude: {coords[1].toFixed(6)} | Longitude: {coords[0].toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}

        {locationError && !coords && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Location Access Required</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Please enable location services to continue. You can also manually enter your address.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving Address...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* INFO NOTE */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <Navigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500">
            Your pickup location will be used for order collections. Make sure this is accurate 
            to ensure smooth order pickups. Location services help us verify your business address.
          </p>
        </div>
      </div>
    </div>
  );
}