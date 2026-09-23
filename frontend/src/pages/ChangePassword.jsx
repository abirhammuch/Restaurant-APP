import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeft, FaLock } from "react-icons/fa";

const ChangePassword = () => {
  const { backendUrl, navigate } = useContext(AppContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/change-password`,
        { currentPassword, newPassword },
        { headers: { usertoken: localStorage.getItem("usertoken") } },
      );
      if (response.data.success) {
        toast.success("Password changed successfully");
        navigate("/");
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fffaf2] px-4 py-10">
      <section className="mx-auto max-w-lg rounded-[22px] bg-white/90 px-6 py-8 shadow-[0_24px_70px_-28px_rgba(92,57,32,0.35)] sm:px-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-7 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#ed5e13]"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#2b1210]">
          Change <span className="text-[#f36b18]">password</span>
        </h1>
        <p className="mt-2 text-slate-500">
          Update your password from your profile settings.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {[
            ["Current password", currentPassword, setCurrentPassword],
            ["New password", newPassword, setNewPassword],
            ["Confirm password", confirmPassword, setConfirmPassword],
          ].map(([label, value, setter]) => (
            <label key={label} className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#321818]">
                <FaLock className="text-[#ff6b16]" />
                {label}
              </span>
              <input
                value={value}
                onChange={(event) => setter(event.target.value)}
                type="password"
                minLength="8"
                required
                className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </label>
          ))}
          <button
            disabled={loading}
            className="h-13 w-full rounded-xl bg-gradient-to-r from-[#ff7817] to-[#f45f0c] text-lg font-bold text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Change password"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ChangePassword;
