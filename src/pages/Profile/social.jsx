import { useState, useEffect } from "react";
import api from "../../serviceAuth/axios";
import { useAuth } from "../../serviceAuth/context";
import Swal from "sweetalert2";
import {
  Instagram,
  Facebook,
  MessageCircle,
  Edit2,
  Save,
  X,
  Loader2,
  Share2,
  AlertCircle,
  Globe,
  Link2,
} from "lucide-react";

export default function SocialDetails({seller}) {
  // const { sellerData } = useAuth();
  // const sellerDD = sellerData?.seller || {};
  const sellerDD = seller;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp: "",
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
    website: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sellerDD?.socialAccount) {
      setFormData({
        whatsapp: sellerDD.socialAccount.whatsapp || "",
        instagram: sellerDD.socialAccount.instagram || "",
        facebook: sellerDD.socialAccount.facebook || "",
        twitter: sellerDD.socialAccount.twitter || "",
        youtube: sellerDD.socialAccount.youtube || "",
        website: sellerDD.socialAccount.website || "",
      });
    }
  }, [sellerDD]);

  // Validation functions
  const validateWhatsApp = (whatsapp) => {
    if (!whatsapp) return "";
    // WhatsApp number validation (international format)
    const whatsappRegex = /^[+]?[0-9]{10,15}$/;
    if (!whatsappRegex.test(whatsapp.replace(/\s/g, ""))) {
      return "Invalid WhatsApp number (e.g., +919876543210)";
    }
    return "";
  };

  const validateInstagram = (instagram) => {
    if (!instagram) return "";
    // Instagram username validation
    const instagramRegex = /^@?[a-zA-Z0-9._]{1,30}$/;
    if (!instagramRegex.test(instagram.replace("@", ""))) {
      return "Invalid Instagram username";
    }
    return "";
  };

  const validateFacebook = (facebook) => {
    if (!facebook) return "";
    // Facebook URL or username validation
    const facebookRegex =
      /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+$/;
    const usernameRegex = /^[a-zA-Z0-9.]{5,50}$/;

    if (!facebookRegex.test(facebook) && !usernameRegex.test(facebook)) {
      return "Invalid Facebook URL or username";
    }
    return "";
  };

  const validateTwitter = (twitter) => {
    if (!twitter) return "";
    // Twitter username validation
    const twitterRegex = /^@?[a-zA-Z0-9_]{1,15}$/;
    if (!twitterRegex.test(twitter.replace("@", ""))) {
      return "Invalid Twitter username (max 15 characters)";
    }
    return "";
  };

  const validateYoutube = (youtube) => {
    if (!youtube) return "";
    // YouTube URL or channel ID validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const channelRegex = /^[a-zA-Z0-9_-]{1,50}$/;

    if (!youtubeRegex.test(youtube) && !channelRegex.test(youtube)) {
      return "Invalid YouTube URL or channel ID";
    }
    return "";
  };

  const validateWebsite = (website) => {
    if (!website) return "";
    // Website URL validation
    const websiteRegex =
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(:\d+)?(\/.*)?$/;
    if (!websiteRegex.test(website)) {
      return "Invalid website URL (e.g., https://example.com)";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    let error = "";

    switch (name) {
      case "whatsapp":
        processedValue = value.replace(/[^0-9+]/g, "");
        error = validateWhatsApp(processedValue);
        break;
      case "instagram":
        processedValue = value.replace("@", "");
        error = validateInstagram(processedValue);
        break;
      case "facebook":
        error = validateFacebook(value);
        break;
      case "twitter":
        processedValue = value.replace("@", "");
        error = validateTwitter(processedValue);
        break;
      case "youtube":
        error = validateYoutube(value);
        break;
      case "website":
        error = validateWebsite(value);
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

  const validateForm = () => {
    const newErrors = {
      whatsapp: validateWhatsApp(formData.whatsapp),
      instagram: validateInstagram(formData.instagram),
      facebook: validateFacebook(formData.facebook),
      twitter: validateTwitter(formData.twitter),
      youtube: validateYoutube(formData.youtube),
      website: validateWebsite(formData.website),
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

    try {
      setLoading(true);

      const payload = {
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
        youtube: formData.youtube,
        website: formData.website,
      };

      // const res = await api.put("/seller/profile/update", payload);

      const id = seller?.userId?._id;

          const res = await api.put(`/seller/profile/update/${id}`, payload);


      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: res.data.message || "Social details updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsEditing(false);
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating social details:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update social details",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (sellerDD?.socialAccount) {
      setFormData({
        whatsapp: sellerDD.socialAccount.whatsapp || "",
        instagram: sellerDD.socialAccount.instagram || "",
        facebook: sellerDD.socialAccount.facebook || "",
        twitter: sellerDD.socialAccount.twitter || "",
        youtube: sellerDD.socialAccount.youtube || "",
        website: sellerDD.socialAccount.website || "",
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  // Format social links for display
  const formatSocialLink = (platform, value) => {
    if (!value) return "N/A";

    switch (platform) {
      case "whatsapp":
        return value;
      case "instagram":
        return `@${value}`;
      case "facebook":
        if (value.includes("facebook.com")) return value;
        return `facebook.com/${value}`;
      case "twitter":
        return `@${value}`;
      case "youtube":
        return value;
      case "website":
        return value;
      default:
        return value;
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case "facebook":
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case "twitter":
        return <Share2 className="w-5 h-5 text-blue-400" />;
      case "youtube":
        return <Share2 className="w-5 h-5 text-red-600" />;
      case "website":
        return <Globe className="w-5 h-5 text-purple-600" />;
      default:
        return <Link2 className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-800">Social Links</h3>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-green-600" />
              WhatsApp Number
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.whatsapp ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+919876543210"
                  maxLength={15}
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.whatsapp}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {getSocialIcon("whatsapp")}
                <a
                  href={`https://wa.me/${formData.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-green-600 transition-colors"
                >
                  {formatSocialLink("whatsapp", formData.whatsapp)}
                </a>
              </div>
            )}
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Instagram className="w-4 h-4 text-pink-600" />
              Instagram
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.instagram ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="username"
                />
                {errors.instagram && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.instagram}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {getSocialIcon("instagram")}
                {formData.instagram ? (
                  <a
                    href={`https://instagram.com/${formData.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-pink-600 transition-colors"
                  >
                    @{formData.instagram}
                  </a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            )}
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.facebook ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="username or profile URL"
                />
                {errors.facebook && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.facebook}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {getSocialIcon("facebook")}
                {formData.facebook ? (
                  <a
                    href={
                      formData.facebook.includes("facebook.com")
                        ? formData.facebook
                        : `https://facebook.com/${formData.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {formatSocialLink("facebook", formData.facebook)}
                  </a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            )}
          </div>

          {/* Twitter/X */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Share2 className="w-4 h-4 text-blue-400" />
              Twitter/X
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.twitter ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="username"
                />
                {errors.twitter && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.twitter}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {getSocialIcon("twitter")}
                {formData.twitter ? (
                  <a
                    href={`https://twitter.com/${formData.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-blue-400 transition-colors"
                  >
                    @{formData.twitter}
                  </a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            )}
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Share2 className="w-4 h-4 text-red-600" />
              YouTube
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.youtube ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Channel URL or ID"
                />
                {errors.youtube && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.youtube}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {getSocialIcon("youtube")}
                {formData.youtube ? (
                  <a
                    href={
                      formData.youtube.includes("youtube.com")
                        ? formData.youtube
                        : `https://youtube.com/@${formData.youtube}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-red-600 transition-colors"
                  >
                    {formData.youtube}
                  </a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Globe className="w-4 h-4 text-purple-600" />
              Website
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {isEditing ? (
              <>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.website}
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {getSocialIcon("website")}
                {formData.website ? (
                  <a
                    href={
                      formData.website.startsWith("http")
                        ? formData.website
                        : `https://${formData.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-purple-600 transition-colors"
                  >
                    {formData.website}
                  </a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Validation Summary */}
        {isEditing && Object.values(errors).some((error) => error !== "") && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Please fix the validation errors before saving
            </p>
          </div>
        )}

        {/* Info Note */}
        {!isEditing && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Connect your social media accounts to help customers find and
              trust your business
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
