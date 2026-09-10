import React from "react";
import { Mail, X, Send } from "lucide-react";

const SendOTP = ({ email, onClose, onSendOTP }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-7">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Mail size={30} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-slate-900 text-center mt-5">
          Verify Your Email
        </h2>

        <p className="text-sm text-slate-500 text-center mt-2 leading-6">
          To create your TechNova account, verify your
          work email address.
        </p>

        {/* Email */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-slate-700">
            Work Email
          </label>

          <div className="mt-2 w-full h-11 border border-slate-200 rounded-lg bg-slate-50 flex items-center px-4 text-sm text-slate-600">
            {email}
          </div>
        </div>

        {/* Send OTP */}
        <button
          onClick={onSendOTP}
          className="w-full h-11 mt-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <Send size={16} />
          Send OTP
        </button>

      </div>
    </div>
  );
};

export default SendOTP;