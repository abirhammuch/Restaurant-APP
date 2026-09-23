import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(AppContext);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email },
      );
      if (response.data.success) {
        setStep("otp");
        toast.success("If the account exists, an OTP was sent to your email.");
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        {
          email,
          otp,
          newPassword,
        },
      );
      if (response.data.success) {
        toast.success("Password reset successfully. Please sign in.");
        navigate("/login");
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#fffaf2] px-4 py-10">
      <section className="relative z-10 w-full max-w-[540px] rounded-[22px] border border-white/80 bg-white/90 px-6 py-8 shadow-[0_24px_70px_-28px_rgba(92,57,32,0.35)] sm:px-12 sm:py-10">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mb-7 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#ed5e13]"
        >
          <FaArrowLeft /> Back to sign in
        </button>
        <div className="text-center">
          <img
            src="/logo2.png"
            alt="Tana Cafe"
            className="mx-auto h-24 w-24 object-contain"
          />
          <h1 className="mt-4 text-3xl font-bold text-[#2b1210]">
            Reset your <span className="text-[#f36b18]">password</span>
          </h1>
          <p className="mt-2 text-slate-500">
            {step === "email"
              ? "We will send a one-time code to your email."
              : "Enter the code from your email and choose a new password."}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={requestOtp} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#321818]">
                <MdEmail className="text-lg text-[#ff6b16]" />
                Email
              </span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="Enter your account email"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <button
              disabled={loading}
              className="h-13 w-full rounded-xl bg-gradient-to-r from-[#ff7817] to-[#f45f0c] text-lg font-bold text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#321818]">
                6-digit OTP
              </span>
              <input
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                pattern="[0-9]{6}"
                required
                placeholder="Enter OTP"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 tracking-[0.4em] focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#321818]">
                <FaLock className="text-[#ff6b16]" />
                New password
              </span>
              <input
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                minLength="8"
                required
                placeholder="At least 8 characters"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#321818]">
                <FaLock className="text-[#ff6b16]" />
                Confirm password
              </span>
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                minLength="8"
                required
                placeholder="Repeat your password"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <button
              disabled={loading}
              className="h-13 w-full rounded-xl bg-gradient-to-r from-[#ff7817] to-[#f45f0c] text-lg font-bold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Reset password"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm font-semibold text-[#ed5e13] hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default ForgotPassword;
