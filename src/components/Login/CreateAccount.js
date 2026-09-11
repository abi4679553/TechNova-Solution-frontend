import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { RiUserLine,RiIdCardLine,RiMailLine,RiPhoneLine,RiLockPasswordLine,RiEyeLine,RiEyeOffLine,RiArrowRightLine,RiShieldCheckLine,} from "react-icons/ri";
import logo from "../../Assests/logo.png";
import SendOTP from "./SendOtp";
import VerifyOTP from "./VerifyOtp";

const CreateAccount = () => {
  const navigate = useNavigate();

  // ================= STATES =================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Send OTP Popup
  const [showSendOTP, setShowSendOTP] = useState(false);

  // Verify OTP Popup
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);

  // ================= FORM DATA =================

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    personalEmail: "",
    workEmail: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  // ================= HANDLE INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= CREATE ACCOUNT SUBMIT =================

  const handleSubmit = (e) => {
    e.preventDefault();

    // Full Name Validation
    if (formData.fullName.trim().length < 3) {
      alert("Please enter a valid name");
      return;
    }

    // Employee ID Validation
    if (formData.employeeId.trim().length < 3) {
      alert("Please enter your Employee ID");
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.personalEmail)) {
      alert("Please enter a valid personal email");
      return;
    }

    if (!emailRegex.test(formData.workEmail)) {
      alert("Please enter a valid work email");
      return;
    }

    // Phone Validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Password Validation
    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters");
      return;
    }

    // Confirm Password Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Terms Validation
    if (!formData.terms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    console.log("Create Account Data:", formData);

    // Open Send OTP Popup
    setShowSendOTP(true);
  };

  // ================= SEND OTP =================

  const handleSendOTP = () => {
    console.log("OTP Sent to:", formData.workEmail);

    // Close Send OTP Popup
    setShowSendOTP(false);

    // Open Verify OTP Popup
    setShowVerifyOTP(true);
  };

  // ================= VERIFY OTP =================

  const handleVerifyOTP = (enteredOTP) => {
    console.log("Entered OTP:", enteredOTP);

    // Temporary frontend OTP
    if (enteredOTP === "123456") {
      alert("OTP Verified Successfully!");

      // Close Verify OTP Popup
      setShowVerifyOTP(false);

      console.log("Account Details:", formData);

      navigate("/login")

      // Backend connect pannumbothu
      // inga account create API call pannalam
    } else {
      alert("Invalid OTP!");
    }
  };

  // ================= RESEND OTP =================

  const handleResendOTP = () => {
    console.log("OTP Resent to:", formData.workEmail);

    alert("OTP has been resent!");
  };

  // ================= RETURN =================

  return (
    <section className="min-h-[calc(100vh-94px)] bg-gray-50 px-4 py-6 sm:px-6 sm:py-10 flex items-center justify-center">

      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <div className="hidden lg:flex bg-primary text-white p-10 xl:p-14 relative overflow-hidden items-center">

          {/* Background Circles */}

          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/10" />

          <div className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full bg-white/10" />

          <div className="mb-[50%] relative z-10">

            {/* Logo */}

            <img
              src={logo}
              alt="TechNova Solutions"
              className=""
            />

            {/* Heading */}

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mt-[10%]">
              Join TechNova.
              <br />
              Connect.
              <br />
              Grow.
            </h1>

            {/* Description */}

            <p className="mt-6 text-blue-100 text-base xl:text-lg leading-relaxed max-w-md">
              Create your company account and connect
              with your team through one powerful
              workspace.
            </p>

            {/* Security */}

            <div className="mt-10 flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <RiShieldCheckLine className="text-2xl" />
              </div>

              <div>

                <p className="font-semibold">
                  Secure & Reliable
                </p>

                <p className="text-sm text-blue-100">
                  Your information is protected
                </p>

              </div>

            </div>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="w-full p-5 sm:p-8 md:p-10 lg:p-12">

          <div className="w-full max-w-md mx-auto">

            {/* ================= MOBILE LOGO ================= */}

            <div className="flex justify-center lg:hidden mb-6 sm:mb-8">

              <img
                src={logo}
                alt="TechNova Solutions"
                className="w-44 sm:w-52 h-auto object-contain"
              />

            </div>

            {/* ================= HEADING ================= */}

            <div className="mb-6 sm:mb-8">

              <h2 className="text-2xl sm:text-3xl font-bold text-secondary">
                Create Account
              </h2>

              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Create your TechNova company account
              </p>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* ================= FULL NAME ================= */}

              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                </div>

              </div>

              {/* ================= EMPLOYEE ID ================= */}

              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Employee ID
                </label>

                <div className="relative">

                  <RiIdCardLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter your employee ID"
                    required
                    className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                </div>

              </div>

              {/* ================= PERSONAL EMAIL ================= */}

              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Personal Email
                </label>

                <div className="relative">

                  <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    placeholder="Enter your personal email"
                    required
                    className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                </div>

              </div>

              {/* ================= WORK EMAIL ================= */}

              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Work Email
                </label>

                <div className="relative">

                  <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type="email"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    placeholder="Enter your work email"
                    required
                    className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                </div>

              </div>

              {/* ================= PHONE NUMBER ================= */}

              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Phone Number
                </label>

                <div className="relative">

                  <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    maxLength="10"
                    className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                </div>

              </div>

              {/* ================= PASSWORD ================= */}

              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Password
                </label>

                <div className="relative">

                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-primary"
                  >
                    {showPassword ? (
                      <RiEyeOffLine />
                    ) : (
                      <RiEyeLine />
                    )}
                  </button>

                </div>

              </div>

              {/* ================= CONFIRM PASSWORD ================= */}

              <div>

                <label className="block text-sm font-semibold text-secondary mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-primary"
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine />
                    ) : (
                      <RiEyeLine />
                    )}
                  </button>

                </div>

              </div>

              {/* ================= TERMS ================= */}

              <div className="flex items-start gap-2 pt-1">

                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 accent-primary"
                />

                <p className="text-xs sm:text-sm text-gray-500">

                  I agree to the{" "}

                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                  >
                    Terms & Conditions
                  </button>

                  {" "}and{" "}

                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                  >
                    Privacy Policy
                  </button>

                </p>

              </div>

              {/* ================= CREATE ACCOUNT BUTTON ================= */}

              <button
                type="submit"
                className="w-full h-12 sm:h-14 flex items-center justify-center gap-2 bg-primary text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition shadow-lg shadow-primary/20"
              >

                Create Account

                <RiArrowRightLine className="text-xl" />

              </button>

            </form>

            {/* ================================================= */}
            {/* SEND OTP POPUP */}
            {/* ================================================= */}

            {showSendOTP && (
              <SendOTP
                email={formData.workEmail}
                onClose={() => setShowSendOTP(false)}
                onSendOTP={handleSendOTP}
              />
            )}

            {/* ================================================= */}
            {/* VERIFY OTP POPUP */}
            {/* ================================================= */}

            {showVerifyOTP && (
              <VerifyOTP
                email={formData.workEmail}
                onClose={() => setShowVerifyOTP(false)}
                onVerifyOTP={handleVerifyOTP}
                onResendOTP={handleResendOTP}
              />
            )}

            {/* ================= LOGIN ================= */}

            <div className="text-center mt-6">

              <p className="text-sm text-gray-500">
                Already have an account?
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-1 text-primary font-semibold hover:underline"
              >
                Login
              </button>

            </div>

            {/* ================= FOOTER ================= */}

            <p className="text-center text-[11px] sm:text-xs text-gray-400 mt-6">
              © 2026 TechNova Solutions. All rights reserved.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CreateAccount;