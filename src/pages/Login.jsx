import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../serviceAuth/axios";
import { useAuth } from "../serviceAuth/context";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const [isotpsend, setIsOtpSend] = useState(false);
  const { setToken } = useAuth();

  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!validateMobile(mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Enter valid mobile number",
      }));
      return;
    }
    try {
      setIsOtpSend(true);
      const res = await api.post("/otp/send", { mobile });
      Swal.fire({
        toast: true,
        position: "top-right",
        icon: "success",
        title: res.data.message || "OTP sent successfully",
        showConfirmButton: false,
        timer: 1500,
        width: "300px",
        padding: "10px",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        toast: true,
        position: "top-right",
        icon: "error",
        title: err.response?.data?.message || "Failed to send OTP",
        showConfirmButton: false,
        timer: 1500,
        width: "300px",
        padding: "10px",
      });
    } finally {
      setIsOtpSend(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (loginMethod === "email") {
      if (!validateEmail(email)) newErrors.email = "Invalid email";
      if (!password) newErrors.password = "Password required";
    }

    if (loginMethod === "mobile") {
      if (!validateMobile(mobile)) {
        newErrors.mobile = "Mobile must start from 6–9 and be 10 digits";
      }
      if (useOtp) {
        if (otp.length !== 6) newErrors.otp = "OTP must be 6 digits";
      } else {
        if (!password) newErrors.password = "Password required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors);
      return setErrors(newErrors);
    }

    try {
      setIsLoading(true);
      const payload =
        loginMethod === "email"
          ? { email, password }
          : useOtp
            ? { mobile, otp }
            : { mobile, password };

      const { data } = await api.post("/auth/login", payload);
      // console.log("Login successful:", data);
      if (data.success) {
        Swal.fire({
          toast: true,
          position: "top-right",
          icon: "success",
          title: data.message || "Login successful",
          showConfirmButton: false,
          timer: 1500,
          width: "300px",
          padding: "10px",
        });
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        toast: true,
        position: "top-right",
        icon: "error",
        title: err.response?.data?.message || "Login failed",
        showConfirmButton: false,
        timer: 1500,
        width: "300px",
        padding: "10px",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/image/login-bg-img.jpg')",
      }}
    >
      <div className="relative z-10 flex min-h-screen max-w-6xl items-center justify-between px-20 mx-auto">
        {/* LEFT SIDE */}
        <div className="text-white max-w-xl md:mt-40">
          <h1 className="text-6xl font-bold tracking-wide">WELCOME</h1>
          <p className="mt-4 text-xl text-gray-200">
            Support that adapts to you.
          </p>
        </div>
        {/* LOGIN FORM */}
        <div className="w-[400px] text-white ">
          <h2 className="text-4xl font-bold mb-6 text-center">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL LOGIN */}
            {loginMethod === "email" && (
              <>
                <div>
                  <label className="text-xl font-bold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-xl font-bold">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
                <p
                  onClick={() => {
                    setLoginMethod("mobile");
                    setPassword("");
                    setErrors({});
                  }}
                  className="text-blue-400 cursor-pointer text-sm mt-2"
                >
                  Login with Mobile Number
                </p>
              </>
            )}
            {/* MOBILE LOGIN */}
            {loginMethod === "mobile" && (
              <>
                <div>
                  <label className="text-xl font-bold">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setMobile(value);
                        setErrors((prev) => ({ ...prev, mobile: "" }));
                      }
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                    // required
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm">{errors.mobile}</p>
                  )}
                </div>
                {/* Toggle Password / OTP */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUseOtp(false)}
                    className={`px-4 py-2 rounded-md ${
                      !useOtp ? "bg-[#927f68]" : "bg-gray-600"
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseOtp(true)}
                    className={`px-4 py-2 rounded-md ${
                      useOtp ? "bg-[#927f68]" : "bg-gray-600"
                    }`}
                  >
                    OTP
                  </button>
                  {useOtp && (
                    <button
                      type="button"
                      disabled={isotpsend}
                      onClick={handleSendOtp}
                      className={`px-4 py-2 rounded-md cursor-pointer ${
                        (useOtp ? "bg-[#927f68]" : "bg-gray-600",
                        isotpsend ? "opacity-50 cursor-not-allowed" : "")
                      }`}
                    >
                      {isotpsend ? "Sending..." : "Send OTP"}
                    </button>
                  )}
                </div>
                {!useOtp && (
                  <div>
                    <label className="text-xl font-bold">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                      //   required
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                )}
                {useOtp && (
                  <div>
                    <label className="text-xl font-bold">Enter OTP</label>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 6) {
                          setOtp(value);
                          setErrors((prev) => ({ ...prev, otp: "" }));
                        }
                      }}
                      onBlur={() => {
                        if (otp.length !== 6) {
                          setErrors((prev) => ({
                            ...prev,
                            otp: "OTP must be exactly 6 digits",
                          }));
                        }
                      }}
                      placeholder="Enter 6-digit OTP"
                      className={`w-full mt-1 px-3 py-2 rounded-md bg-white text-black border ${
                        errors.otp ? "border-red-500" : "border-transparent"
                      }`}
                      required
                    />

                    {/* Red Error Message */}
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                    )}
                  </div>
                )}
                <p
                  onClick={() => {
                    setLoginMethod("email");
                    setPassword("");
                    setOtp("");
                    setMobile("");
                  }}
                  className="text-blue-400 cursor-pointer text-sm mt-2"
                >
                  Login with Email
                </p>
              </>
            )}

            {/* Continue Button */}
            {loginMethod && (
              <button
                type="submit"
                disabled={
                  isloading ||
                  (!validateEmail(email) && loginMethod === "email") ||
                  (!validateMobile(mobile) && loginMethod === "mobile")
                }
                className={`w-full bg-[#927f68] hover:bg-[#774b52] py-2 rounded-md font-medium mt-4 ${
                  isloading
                    ? "opacity-50 cursor-not-allowed"
                    : !validateEmail(email) && loginMethod === "email"
                      ? "opacity-50 cursor-not-allowed"
                      : !validateMobile(mobile) && loginMethod === "mobile"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
              >
                {isloading ? "Loading..." : "Continue"}
              </button>
            )}
          </form>

          <p className="text-center text-sm mt-4">
            <Link
              to="/register"
              className="text-blue-400 hover:underline flex float-end font-bold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
