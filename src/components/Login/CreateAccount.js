import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  RiUserLine,
  RiIdCardLine,
  RiMailLine,
  RiPhoneLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightLine,
  RiShieldCheckLine,
} from "react-icons/ri";

import logo from "../../Assests/logo.png";
import SendOTP from "./SendOtp";
import VerifyOTP from "./VerifyOtp";

const CreateAccount = () => {
  const navigate = useNavigate();

  // ================= STATES =================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showSendOTP, setShowSendOTP] = useState(false);
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

  // ================= ERRORS =================

  const [errors, setErrors] = useState({});

  // ================= LIVE VALIDATION =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    let errorMessage = "";

    // Full Name
    if (name === "fullName") {
      if (value.trim() === "") {
        errorMessage = "Full name is required";
      } else if (value.trim().length < 3) {
        errorMessage = "Name must contain at least 3 characters";
      }
    }

    // Employee ID
    if (name === "employeeId") {
      if (value.trim() === "") {
        errorMessage = "Employee ID is required";
      } else if (value.trim().length < 3) {
        errorMessage = "Employee ID must contain at least 3 characters";
      }
    }

    // Email
    if (name === "personalEmail" || name === "workEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value.trim() === "") {
        errorMessage =
          name === "personalEmail"
            ? "Personal email is required"
            : "Work email is required";
      } else if (!emailRegex.test(value.trim())) {
        errorMessage =
          name === "personalEmail"
            ? "Please enter a valid personal email"
            : "Please enter a valid work email";
      }
    }

    // Phone Number
    if (name === "phoneNumber") {
      const phoneRegex = /^[6-9]\d{9}$/;

      if (value.trim() === "") {
        errorMessage = "Phone number is required";
      } else if (!phoneRegex.test(value.trim())) {
        errorMessage = "Enter a valid 10-digit phone number";
      }
    }

    // Password
    if (name === "password") {
      if (value === "") {
        errorMessage = "Password is required";
      } else if (value.length < 8) {
        errorMessage = "Password must contain at least 8 characters";
      }

      // Confirm password also check
      if (formData.confirmPassword !== "") {
        setErrors((prev) => ({
          ...prev,
          password: errorMessage,
          confirmPassword:
            value === formData.confirmPassword
              ? ""
              : "Passwords do not match",
        }));

        return;
      }
    }

    // Confirm Password
    if (name === "confirmPassword") {
      if (value === "") {
        errorMessage = "Please confirm your password";
      } else if (value !== formData.password) {
        errorMessage = "Passwords do not match";
      }
    }

    // Terms
    if (name === "terms") {
      if (!checked) {
        errorMessage = "Please accept Terms & Conditions";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  // ================= FULL FORM VALIDATION =================

  const validateForm = () => {
    const newErrors = {};

    // Full Name
    if (formData.fullName.trim() === "") {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must contain at least 3 characters";
    }

    // Employee ID
    if (formData.employeeId.trim() === "") {
      newErrors.employeeId = "Employee ID is required";
    } else if (formData.employeeId.trim().length < 3) {
      newErrors.employeeId =
        "Employee ID must contain at least 3 characters";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.personalEmail.trim() === "") {
      newErrors.personalEmail = "Personal email is required";
    } else if (!emailRegex.test(formData.personalEmail.trim())) {
      newErrors.personalEmail =
        "Please enter a valid personal email";
    }

    if (formData.workEmail.trim() === "") {
      newErrors.workEmail = "Work email is required";
    } else if (!emailRegex.test(formData.workEmail.trim())) {
      newErrors.workEmail =
        "Please enter a valid work email";
    }

    // Phone
    const phoneRegex = /^[6-9]\d{9}$/;

    if (formData.phoneNumber.trim() === "") {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber =
        "Enter a valid 10-digit phone number";
    }

    // Password
    if (formData.password === "") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters";
    }

    // Confirm Password
    if (formData.confirmPassword === "") {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    // Terms
    if (!formData.terms) {
      newErrors.terms =
        "Please accept Terms & Conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= CREATE ACCOUNT SUBMIT =================

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    console.log("Create Account Data:", formData);

    // Open Send OTP Popup
    setShowSendOTP(true);
  };

  // ================= SEND OTP =================

  const handleSendOTP = () => {
    console.log("OTP Sent to:", formData.workEmail);

    setShowSendOTP(false);
    setShowVerifyOTP(true);
  };

  // ================= VERIFY OTP =================

  const handleVerifyOTP = (enteredOTP) => {
    console.log("Entered OTP:", enteredOTP);

    // Temporary frontend OTP
    if (enteredOTP === "123456") {
      alert("OTP Verified Successfully!");

      setShowVerifyOTP(false);

      console.log("Account Details:", formData);

      navigate("/login");

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
                    className={`w-full h-12 pl-11 pr-4 border rounded-xl text-sm outline-none transition ${
                      errors.fullName
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
                  />

                </div>

                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName}
                  </p>
                )}

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
                    className={`w-full h-12 pl-11 pr-4 border rounded-xl text-sm outline-none transition ${
                      errors.employeeId
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
                  />

                </div>

                {errors.employeeId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.employeeId}
                  </p>
                )}

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
                    className={`w-full h-12 pl-11 pr-4 border rounded-xl text-sm outline-none transition ${
                      errors.personalEmail
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
                  />

                </div>

                {errors.personalEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.personalEmail}
                  </p>
                )}

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
                    className={`w-full h-12 pl-11 pr-4 border rounded-xl text-sm outline-none transition ${
                      errors.workEmail
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
                  />

                </div>

                {errors.workEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.workEmail}
                  </p>
                )}

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
                    className={`w-full h-12 pl-11 pr-4 border rounded-xl text-sm outline-none transition ${
                      errors.phoneNumber
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
                  />

                </div>

                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}

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
                    className={`w-full h-12 pl-11 pr-11 border rounded-xl text-sm outline-none transition ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
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

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}

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
                    className={`w-full h-12 pl-11 pr-11 border rounded-xl text-sm outline-none transition ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
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

                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}

              </div>

              {/* ================= TERMS ================= */}

              <div className="pt-1">

                <div className="flex items-start gap-2">

                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 accent-primary"
                  />

                  <p className="text-xs sm:text-sm text-gray-500">

                    I agree to{" "}

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

                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1 ml-6">
                    {errors.terms}
                  </p>
                )}

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

            {/* ================= SEND OTP POPUP ================= */}

            {showSendOTP && (
              <SendOTP
                email={formData.workEmail}
                onClose={() => setShowSendOTP(false)}
                onSendOTP={handleSendOTP}
              />
            )}

            {/* ================= VERIFY OTP POPUP ================= */}

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