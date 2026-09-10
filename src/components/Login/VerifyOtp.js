import React, { useState } from "react";
import { RiMailLine, RiCloseLine, RiErrorWarningLine,} from "react-icons/ri";

const VerifyOTP = ({ email, onClose, onVerifyOTP, onResendOTP,}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  // OTP change
  const handleOtpChange = (value, index) => {
    // Numbers only
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      document
        .getElementById(`otp-${index - 1}`)
        ?.focus();
    }
  };

  // Verify button
  const handleVerify = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    // Send OTP to parent component
    onVerifyOTP(enteredOtp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      {/* Popup */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-7">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-secondary transition"
        >
          <RiCloseLine className="text-2xl" />
        </button>

        {/* Email Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <RiMailLine className="text-3xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-secondary text-center mt-5">
          Verify Your Email
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          Enter the 6-digit verification code sent to
        </p>

        {/* Email */}
        <p className="text-sm font-semibold text-primary text-center mt-1 break-all">
          {email}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-5 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
            <RiErrorWarningLine className="text-lg flex-shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center gap-2 mt-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleOtpChange(
                  e.target.value,
                  index
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold text-secondary border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="button"
          onClick={handleVerify}
          className="w-full h-12 mt-6 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-lg shadow-primary/20"
        >
          Verify OTP
        </button>

        {/* Resend */}
        <div className="text-center mt-5">
          <p className="text-sm text-gray-500">
            Didn't receive the code?
          </p>

          <button
            type="button"
            onClick={() => {
              setOtp(["", "", "", "", "", ""]);
              setError("");
              onResendOTP();
            }}
            className="mt-1 text-sm text-primary font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyOTP;