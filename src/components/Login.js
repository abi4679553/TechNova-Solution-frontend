import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiShieldCheckLine,} from "react-icons/ri";
import logo from "../Assests/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    alert("Login button working!");
  };

  return (
    <section className="min-h-[calc(100vh-94px)] bg-gray-50 px-4 py-6 sm:px-6 sm:py-10 flex items-center justify-center">

      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden lg:flex bg-primary text-white p-10 xl:p-14 relative overflow-hidden items-center">

          {/* Background Circle */}
          <div className="absolute -top-30 -left-32 w-80 h-80 rounded-full bg-white/10" />

          <div className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full bg-white/10" />

          <div className="relative z-10">

            <img
              src={logo}
              alt="TechNova Solutions"
              className=""
            />

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mt-2">
              Connect.
              <br />
              Collaborate.
              <br />
              Grow.
            </h1>

            <p className="mt-6 text-blue-100 text-base xl:text-lg leading-relaxed max-w-md">
              Manage your teams, projects and communication
              from one powerful platform built for modern
              organizations.
            </p>

            <div className="mt-10 flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <RiShieldCheckLine className="text-2xl" />
              </div>

              <div>
                <p className="font-semibold">
                  Secure & Reliable
                </p>

                <p className="text-sm text-blue-100">
                  Your data is protected
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full p-5 sm:p-8 md:p-10 lg:p-12">

          <div className="w-full max-w-md mx-auto">

            {/* Mobile Logo */}
            <div className="flex justify-center lg:hidden mb-6 sm:mb-8">

              <img
                src={logo}
                alt="TechNova Solutions"
                className="w-44 sm:w-52 h-auto object-contain"
              />

            </div>

            {/* Heading */}
            <div className="mb-6 sm:mb-8">

              <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
                Welcome Back
              </h2>

              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Login to your TechNova account
              </p>

            </div>

            {/* ================= FORM ================= */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

              {/* Email */}
              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Work Email
                </label>

                <div className="relative">

                  <RiMailLine className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your work email"
                    required
                    className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 border border-gray-200 rounded-xl text-sm sm:text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-semibold text-secondary">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs sm:text-sm text-primary font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>

                </div>

                <div className="relative">

                  <RiLockPasswordLine className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-12 border border-gray-200 rounded-xl text-sm sm:text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-gray-400 hover:text-primary"
                  >
                    {showPassword ? (
                      <RiEyeOffLine />
                    ) : (
                      <RiEyeLine />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember Me */}
              <div className="flex items-center">

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />

                  <span className="text-xs sm:text-sm text-gray-600">
                    Remember me
                  </span>

                </label>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-12 sm:h-14 flex items-center justify-center gap-2 bg-primary text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition shadow-lg shadow-primary/20"
              >
                Login
                <RiArrowRightLine className="text-lg sm:text-xl" />
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 sm:gap-4 my-6 sm:my-7">

              <div className="flex-1 h-px bg-gray-200" />

              <span className="text-xs sm:text-sm text-gray-400">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-200" />

            </div>

            {/* Register */}
            <div className="text-center">

              <p className="text-xs sm:text-sm text-gray-500">
                New to TechNova?
              </p>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="mt-1.5 text-sm sm:text-base text-primary font-semibold hover:underline"
              >
                Create an Account
              </button>

            </div>

            {/* Footer */}
            <p className="text-center text-[11px] sm:text-xs text-gray-400 mt-6 sm:mt-8">
              © 2026 TechNova Solutions. All rights reserved.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Login;