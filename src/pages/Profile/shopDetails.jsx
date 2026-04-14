import { useState, useEffect } from "react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import { useAuth } from "../../serviceAuth/context";
import { Edit2, Save, X, Clock, MapPin, Store, Building2, Calendar, Truck } from "lucide-react";

export default function ShopDetails({ seller }) {
  // const { sellerData } = useAuth();
  // const sellerDD = sellerData?.seller || seller || {};
  
const sellerDD =  seller;
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    shopName: "",
    businessType: "",
    yearOfExperience: "",
    shopStatus: "",
    deliveryRadiusInKm: "",
    workingHours: [],
    pickupDelivery: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    }
  });

  // useEffect(() => {
  //   if (sellerDD) {
  //     setFormData({
  //       shopName: sellerDD.shopName || "",
  //       businessType: sellerDD.businessType || "",
  //       yearOfExperience: sellerDD.yearOfExperience || "",
  //       shopStatus: sellerDD.shopStatus || "open",
  //       deliveryRadiusInKm: sellerDD.deliveryRadiusInKm || "",
  //       workingHours: sellerDD.workingHours || [],
  //       pickupDelivery: sellerDD.pickupDelivery || {
  //         street: "",
  //         city: "",
  //         state: "",
  //         pincode: "",
  //         country: ""
  //       }
  //     });
  //   }
  // }, [sellerDD]);


  useEffect(() => {
  if (!sellerDD?._id) return;

  setFormData({
    shopName: sellerDD.shopName || "",
    businessType: sellerDD.businessType || "",
    yearOfExperience: sellerDD.yearOfExperience || "",
    shopStatus: sellerDD.shopStatus || "open",
    deliveryRadiusInKm: sellerDD.deliveryRadiusInKm || "",
    workingHours: sellerDD.workingHours || [],
    pickupDelivery: sellerDD.pickupDelivery || {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    }
  });
}, [sellerDD?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (pickupDelivery)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle working hours changes
  const handleWorkingHoursChange = (index, field, value) => {
    const updatedHours = [...formData.workingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData(prev => ({ ...prev, workingHours: updatedHours }));
  };

  // Add working hour slot
  const addWorkingHour = () => {
    setFormData(prev => ({
      ...prev,
      workingHours: [
        ...prev.workingHours,
        { day: "Monday", open: "09:00", close: "18:00", isOpen: true }
      ]
    }));
  };

  // Remove working hour slot
  const removeWorkingHour = (index) => {
    const updatedHours = formData.workingHours.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, workingHours: updatedHours }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Prepare payload - only send the fields you want to update
      const payload = {
        shopName: formData.shopName,
        businessType: formData.businessType,
        yearOfExperience: formData.yearOfExperience,
        shopStatus: formData.shopStatus,
        deliveryRadiusInKm: formData.deliveryRadiusInKm,
        workingHours: formData.workingHours,
        pickupDelivery: formData.pickupDelivery
      };

      // const res = await api.put("/seller/profile/update", payload);

const id = seller?.userId?._id;

       const res = await api.put(`/seller/profile/update/${id}`, payload);
      
      if (res.data.success) {
        Swal.fire("Success", res.data.message || "Shop details updated successfully", "success");
        setIsEditing(false);
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating shop details:", err);
      Swal.fire("Hello!", err.response?.data?.message || "Failed to update shop details", "info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-800">Shop Details</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset to original data
                setFormData({
                  shopName: sellerDD.shopName || "",
                  businessType: sellerDD.businessType || "",
                  yearOfExperience: sellerDD.yearOfExperience || "",
                  shopStatus: sellerDD.shopStatus || "open",
                  deliveryRadiusInKm: sellerDD.deliveryRadiusInKm || "",
                  workingHours: sellerDD.workingHours || [],
                  pickupDelivery: sellerDD.pickupDelivery || {
                    street: "",
                    city: "",
                    state: "",
                    pincode: "",
                    country: ""
                  }
                });
              }}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Store className="w-4 h-4" />
            Shop Name
          </label>
          <input
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Enter shop name"
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            Business Type
          </label>
          {isEditing ? (
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Business Type</option>
              <option value="individual">Individual</option>
              <option value="partnership">Partnership</option>
              <option value="proprietorship">Private Limited</option>
              <option value="pvt_ltd">Public Limited</option>
            </select>
          ) : (
            <input
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Business type"
            />
          )}
        </div>

        {/* Year of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Year of Experience
          </label>
          {isEditing ? (
            <select
              name="yearOfExperience"
              value={formData.yearOfExperience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Experience</option>
              <option value="0-1">0-1 Year</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          ) : (
            <input
              name="yearOfExperience"
              value={formData.yearOfExperience}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Years of experience"
            />
          )}
        </div>

        {/* Shop Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Status</label>
          {isEditing ? (
            <select
              name="shopStatus"
              value={formData.shopStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="temporarily_closed">Temporarily Closed</option>
            </select>
          ) : (
            <input
              name="shopStatus"
              value={formData.shopStatus}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          )}
        </div>

        {/* Delivery Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Delivery Radius (KM)
          </label>
          <input
            type="number"
            name="deliveryRadiusInKm"
            value={formData.deliveryRadiusInKm}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Delivery radius in kilometers"
          />
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Pickup Address
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="pickupDelivery.street"
              value={formData.pickupDelivery?.street || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Street"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
            <input
              name="pickupDelivery.city"
              value={formData.pickupDelivery?.city || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="City"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
            <input
              name="pickupDelivery.state"
              value={formData.pickupDelivery?.state || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="State"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
            <input
              name="pickupDelivery.pincode"
              value={formData.pickupDelivery?.pincode || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Pincode"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Working Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Working Hours
          </label>
          
          {formData.workingHours && formData.workingHours.length > 0 ? (
            <div className="space-y-2">
              {formData.workingHours.map((hour, index) => (
                <div key={index} className="flex gap-2 items-center">
                  {isEditing ? (
                    <>
                      <select
                        value={hour.day}
                        onChange={(e) => handleWorkingHoursChange(index, "day", e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={hour.open}
                        onChange={(e) => handleWorkingHoursChange(index, "open", e.target.value)}
                        disabled={!isEditing}
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hour.close}
                        onChange={(e) => handleWorkingHoursChange(index, "close", e.target.value)}
                        disabled={!isEditing}
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeWorkingHour(index)}
                        disabled={!isEditing}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">
                      {hour.day}: {hour.open} - {hour.close}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No working hours set</p>
          )}
          
          {isEditing && (
            <button
              onClick={addWorkingHour}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              + Add Working Hours
            </button>
          )}
        </div>
      </div>
    </div>
  );
}