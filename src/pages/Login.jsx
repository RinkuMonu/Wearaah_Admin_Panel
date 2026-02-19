import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState("email");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [useOtp, setUseOtp] = useState(false);
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (useOtp && otp.length !== 6) {
            setOtpError("OTP must be exactly 6 digits");
            return;
        }
        if (loginMethod === "email") {
            alert("Login with Email & Password");
        } else if (loginMethod === "mobile") {
            if (useOtp) {
                alert("Login with Mobile & OTP");
            } else {
                alert("Login with Mobile & Password");
            }
        } else {
            alert("Please select login method");
        }
    };
    const [otpError, setOtpError] = useState("");


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
                    <h1 className="text-6xl font-bold tracking-wide">
                        WELCOME
                    </h1>
                    <p className="mt-4 text-xl text-gray-200">
                        Support that adapts to you.
                    </p>
                </div>
                {/* LOGIN FORM */}
                <div className="w-[400px] text-white ">
                    <h2 className="text-4xl font-bold mb-6 text-center">
                        Sign In
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* EMAIL LOGIN */}
                        {loginMethod === "email" && (
                            <>
                                <div>
                                    <label className="text-xl font-bold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xl font-bold">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                                        required
                                    />
                                </div>
                                <p
                                    onClick={() => {
                                        setLoginMethod("mobile");
                                        setPassword("");
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
                                    <label className="text-xl font-bold">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            if (value.length <= 10) {
                                                setMobile(value);
                                            }
                                        }}
                                        placeholder="Enter 10-digit mobile number"
                                        className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                                        required
                                    />
                                </div>
                                {/* Toggle Password / OTP */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setUseOtp(false)}
                                        className={`px-4 py-2 rounded-md ${!useOtp ? "bg-[#927f68]" : "bg-gray-600"
                                            }`}
                                    >
                                        Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseOtp(true)}
                                        className={`px-4 py-2 rounded-md ${useOtp ? "bg-[#927f68]" : "bg-gray-600"
                                            }`}
                                    >
                                        OTP
                                    </button>
                                </div>
                                {!useOtp && (
                                    <div>
                                        <label className="text-xl font-bold">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Enter your password"
                                            className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black"
                                            required
                                        />
                                    </div>
                                )}
                                {useOtp && (
                                    <div>
                                        <label className="text-xl font-bold">
                                            Enter OTP
                                        </label>

                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");

                                                // Allow only up to 6 digits
                                                if (value.length <= 6) {
                                                    setOtp(value);

                                                    // Clear error while typing
                                                    if (value.length === 6) {
                                                        setOtpError("");
                                                    }
                                                }
                                            }}
                                            onBlur={() => {
                                                if (otp.length !== 6) {
                                                    setOtpError("OTP must be exactly 6 digits");
                                                }
                                            }}
                                            placeholder="Enter 6-digit OTP"
                                            className={`w-full mt-1 px-3 py-2 rounded-md bg-white text-black border ${otpError ? "border-red-500" : "border-transparent"
                                                }`}
                                            required
                                        />

                                        {/* Red Error Message */}
                                        {otpError && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {otpError}
                                            </p>
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
                                className="w-full bg-[#927f68] hover:bg-[#774b52] py-2 rounded-md font-medium mt-4"
                            >
                                Continue
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