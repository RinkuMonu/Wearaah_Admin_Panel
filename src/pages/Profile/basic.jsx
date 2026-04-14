import { useState, useEffect } from "react";
import ShopProfilePage from "./shopDetails";
import { useAuth } from "../../serviceAuth/context";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import BankDetails from "./bankDetails";
import KycDetails from "./kycDocument";
import SocialDetails from "./social";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Camera,
  Loader2,
  Save,
  Edit2,
  X,
} from "lucide-react";

export default function UserProfile({sellerId }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [userdata, setSellerData] = useState(null);

  const { user } = useAuth();

const loggedInUserId = user?.user?._id;
const profileUserId = userdata?.userId?._id;

const isSuperAdmin = user?.user?.role === "superadmin";
const isOwnProfile = loggedInUserId === profileUserId;

  useEffect(() => {
  if (!sellerId) return;

  const fetchSeller = async () => {
    try {
      const res = await api.get(`auth/seller/me/${sellerId}`);
      setSellerData(res.data?.seller);
    } catch (err) {
      console.error("Seller fetch error:", err);
    }
  };

  fetchSeller();
}, [sellerId]);

  // const { user, setUser, fetchProfile, fetchSellerData } = useAuth();
  // const userdata = user?.user || {};
  // const userdata = user?.user;
  

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    platformId: "",
  });

  // useEffect(() => {
  //   if (userdata) {
  //     setFormData({
  //       fullName: userdata.name || "",
  //       email: userdata.email || "",
  //       mobile: userdata.mobile || "",
  //       platformId: userdata.platformId || "",
  //     });
  //     setAvatarPreview(userdata.avatar || "");
  //   }
  // }, [userdata]);

useEffect(() => {
  if (!userdata?._id) return;

  const user = userdata?.userId;

  setFormData({
    fullName: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    platformId: user?.platformId || "",
  });

  setAvatarPreview(user?.avatar || "");
}, [userdata?._id]);

  // Validation functions
  const validateName = (name) => {
    if (!name) return "Full name is required";
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return "Only alphabets and spaces are allowed";
    }
    if (name.length < 3) {
      return "Name must be at least 3 characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address";
    }
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required";
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return "Mobile number must be 10 digits";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    let error = "";

    switch (name) {
      case "fullName":
        processedValue = value.replace(/[^A-Za-z\s]/g, "");
        error = validateName(processedValue);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "mobile":
        processedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
        error = validateMobile(processedValue);
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire("Error", "File size should be less than 2MB", "error");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire("Error", "Only JPEG and PNG files are allowed", "error");
        return;
      }

      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fix the errors before saving",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (isSuperAdmin && !isOwnProfile) {
  return Swal.fire({
    title: "Not Allowed ❌",
    text: "Superadmin cannot update other users' basic details",
    icon: "warning",
  });
}
    

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.fullName);
      form.append("email", formData.email);
      form.append("mobile", formData.mobile);

      if (avatarFile) {
        form.append("avatar", avatarFile);
      }

      const res = await api.put("/auth/update", form);

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: res.data.message || "Profile updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // await fetchProfile();
        // await fetchSellerData(); // Refresh seller data if needed

        setIsEditing(false);
        setAvatarFile(null);
        setErrors({});
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: userdata.name || "",
      email: userdata.email || "",
      mobile: userdata.mobile || "",
      platformId: userdata.platformId || "",
    });
    setAvatarPreview(userdata.avatar || "");
    setAvatarFile(null);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#f5efdd] to-[#e8e0cc] rounded-lg p-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account information
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-[#927f68] hover:bg-[#7a6954] text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* USER DETAILS CARD */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              User Details
            </h3>
          </div>

          <div className="p-6">
            {/* Avatar Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={`${BASE_URL}${avatarPreview}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full cursor-pointer transition-colors shadow-lg">
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Platform ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  Platform ID
                </label>
                <input
                  type="text"
                  value={formData.platformId}
                  disabled
                  className="w-full rounded-lg px-3 py-2 text-sm bg-gray-100 border border-gray-200 text-gray-600"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Full Name
                  <span className="text-red-500 text-xs">*</span>
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-800 font-medium py-2">
                    {formData.fullName || "N/A"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email Address
                  <span className="text-red-500 text-xs">*</span>
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-800 py-2">
                    {formData.email || "N/A"}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Mobile Number
                  <span className="text-red-500 text-xs">*</span>
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.mobile ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.mobile}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-800 py-2">
                    {formData.mobile || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* Info Note */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-red-500">*</span> Required fields
              </p>
            </div>
          </div>
        </div>

        {/* SHOP DETAILS SECTION */}
        <ShopProfilePage seller={userdata} />

        {/* BANK DETAILS SECTION */}
        <BankDetails seller={userdata} />

        {/* KYC DETAILS SECTION */}
        <KycDetails seller={userdata} />

        {/* SOCIAL DETAILS SECTION */}
        <SocialDetails seller={userdata} />
      </div>
    </div>
  );
}
