import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error while typing
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      alert("Registration Successful ✅");
      console.log(formData);
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
          <h1 className="text-6xl font-bold tracking-wide">
            WELCOME
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            Support that adapts to you.
          </p>
        </div>

        {/* REGISTER FORM */}
        <div className="w-[400px] text-white">
          <h2 className="text-4xl font-bold mb-6 text-center">
            Register Yourself !
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="font-bold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Your Name"
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 rounded-md bg-white text-black border ${
                  errors.name ? "border-red-500" : "border-transparent"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-bold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Your Email"
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 rounded-md bg-white text-black border ${
                  errors.email ? "border-red-500" : "border-transparent"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="font-bold">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter 10-digit number"
                className={`w-full mt-1 px-3 py-2 rounded-md bg-white text-black border ${
                  errors.mobile ? "border-red-500" : "border-transparent"
                }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-bold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Set a Password"
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 rounded-md bg-white text-black border ${
                  errors.password ? "border-red-500" : "border-transparent"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-bold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="Confirm Password"
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 rounded-md bg-white text-black border ${
                  errors.confirmPassword ? "border-red-500" : "border-transparent"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#927f68] hover:bg-[#774b52] py-2 rounded-md font-medium mt-2"
            >
              Register
            </button>
           <p className="text-center text-sm mt-4">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-blue-400 hover:underline"
  >
    Login
  </Link>
</p>
          </form>
        </div>
      </div>
    </div>
  );
}