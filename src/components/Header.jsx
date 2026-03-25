import { useState, useRef, useEffect } from "react";
import { UserRound, LogOut, KeyRound, User, Package } from "lucide-react";
import { Phone, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../serviceAuth/context";

export default function Header({ toggleSidebar }) {
  const { unseenCount } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState("forgot");

  const [passwordData, setPasswordData] = useState({
    mobile: "",
    otp: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [forgotData, setForgotData] = useState({
    mobile: "",
    otp: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleForgotChange = (e) => {
    const { name, value } = e.target;

    // Only digits for mobile & otp
    if (name === "mobile") {
      const onlyNums = value.replace(/\D/g, "");
      setForgotData({ ...forgotData, mobile: onlyNums });
    } else if (name === "otp") {
      const onlyNums = value.replace(/\D/g, "");
      setForgotData({ ...forgotData, otp: onlyNums });
    } else {
      setForgotData({ ...forgotData, [name]: value });
    }
  };

  const validateForgot = () => {
    let newErrors = {};

    // Mobile validation
    if (!forgotData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (forgotData.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    // OTP validation
    if (!forgotData.otp) {
      newErrors.otp = "OTP is required";
    } else if (forgotData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    // Password validation
    if (!forgotData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (forgotData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotSubmit = () => {
    if (validateForgot()) {
      console.log("Form Valid ✅", forgotData);
    }
  };
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };
  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-black text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[#f5efdd]">Wearaah</span>
            {/* <span className="bg-gray-200 text-black text-xs px-2 py-0.5 rounded font-semibold">
                ERP
              </span> */}
          </div>

          <Menu
            onClick={toggleSidebar}
            className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white ml-8"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <Link to={"/odersPage"}>
              <Package />
              {unseenCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unseenCount}
                </span>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Phone className="w-4 h-4" />
            <span>+91 80 00877 644</span>
          </div>

          <div className="bg-gray-200 text-black text-sm px-3 py-1 rounded-md font-medium">
            2025–2026
          </div>

          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setShowProfile(!showProfile)}
              className="w-9 h-9 rounded-full bg-[#f5efdd] text-[#281c16] flex items-center justify-center cursor-pointer"
            >
              <UserRound size={18} />
            </div>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border z-50">
                <div className="px-4 py-4 border-b">
                  <p className="text-sm font-semibold text-gray-800">Admin</p>
                </div>

                <div className="py-2 text-sm">
                  <Link
                    to="/profile"
                    className="w-full flex items-center gap-3 px-4 py-2 bg-[#f5efdd] text-[#927f68] hover:bg-gray-100"
                  >
                    <User size={16} />
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setActiveTab("forgot");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-[#f5efdd] text-[#927f68] mt-2 hover:bg-gray-100"
                  >
                    <KeyRound size={16} />
                    Change Password
                  </button>

                  <div className="border-t my-2"></div>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= PASSWORD MODAL ================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-3 right-4"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <div className="flex mb-4 ">
              <button
                onClick={() => setActiveTab("forgot")}
                className={`flex-1 py-2 ${
                  activeTab === "forgot" ? "border-b-2 border-[#927f68]" : ""
                }`}
              >
                Forget Password
              </button>

              <button
                onClick={() => setActiveTab("modify")}
                className={`flex-1 py-2 ${
                  activeTab === "modify" ? "border-b-2 border-[#927f68]" : ""
                }`}
              >
                Modify Password
              </button>
            </div>

            {activeTab === "forgot" && (
              <div className="space-y-3">
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    value={forgotData.mobile}
                    onChange={handleForgotChange}
                    placeholder="Mobile Number"
                    maxLength={10}
                    className="w-full border border-gray-200 px-3 py-2 rounded-md"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="otp"
                    value={forgotData.otp}
                    onChange={handleForgotChange}
                    placeholder="OTP"
                    maxLength={6}
                    className="w-full border border-gray-200 px-3 py-2 rounded-md"
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="newPassword"
                    value={forgotData.newPassword}
                    onChange={handleForgotChange}
                    placeholder="New Password"
                    className="w-full border border-gray-200 px-3 py-2 rounded-md"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleForgotSubmit}
                  className="w-full bg-[#927f68] text-white py-2 rounded-md"
                >
                  Reset Password
                </button>
              </div>
            )}

            {activeTab === "modify" && (
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full border border-gray-200 px-3 py-2 rounded-md"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full border border-gray-200 px-3 py-2 rounded-md"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full borderborder-gray-200  px-3 py-2 rounded-md"
                />
                <button className="w-full bg-[#927f68] text-white py-2 rounded-md">
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
