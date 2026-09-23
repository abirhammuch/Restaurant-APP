import React, { useContext, useEffect, useRef, useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const {
    userLogin,
    setUserLogin,
    navigate,
    backendUrl,
    usertoken,
    setUsertoken,
    setCurrentUser,
    admintoken,
    setAdmintoken,
  } = useContext(AppContext);

  const googleButtonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      if (userLogin) {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setUsertoken(response.data.usertoken);
          setCurrentUser(response.data.user);
          setUserLogin(true);
          localStorage.setItem("usertoken", response.data.usertoken);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
          confirmPassword,
        });
        console.log(response);
        if (response.data.success) {
          setUsertoken(response.data.usertoken);
          setCurrentUser(response.data.user);
          setUserLogin(true);
          localStorage.setItem("usertoken", response.data.usertoken);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (usertoken) {
      navigate("/");
    }
  }, [usertoken]);

  useEffect(() => {
    const loadGoogleScript = () => {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        console.warn("VITE_GOOGLE_CLIENT_ID is not configured.");
        return;
      }

      const initializeGoogle = () => {
        if (!window.google?.accounts?.id || !googleButtonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
        });

        setGoogleReady(true);
      };

      if (window.google?.accounts?.id) {
        initializeGoogle();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadGoogleScript();
  }, [backendUrl]);

  const handleGoogleCredentialResponse = async (response) => {
    const idToken = response?.credential;
    if (!idToken) {
      toast.error("Google authentication failed. Please try again.");
      return;
    }

    try {
      const googleResponse = await axios.post(
        backendUrl + "/api/user/google-auth",
        {
          idToken,
        },
      );

      if (googleResponse.data.success) {
        setUsertoken(googleResponse.data.usertoken);
        setCurrentUser(googleResponse.data.user);
        setUserLogin(true);
        localStorage.setItem("usertoken", googleResponse.data.usertoken);
      } else {
        toast.error(googleResponse.data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Google login failed. Please try again.",
      );
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#fffaf2] px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#f3e8ce] opacity-70" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-60 w-60 rounded-full bg-[#f9c47c] opacity-60" />
      <div className="pointer-events-none absolute left-5 top-1/2 hidden text-5xl text-[#b7ca8c] opacity-70 sm:block">
        ⌁
      </div>
      <div className="pointer-events-none absolute bottom-20 right-6 hidden text-6xl text-[#b7ca8c] opacity-70 sm:block">
        ⌁
      </div>
      <section className="relative z-10 w-full max-w-[540px] rounded-[22px] border border-white/80 bg-white/90 px-6 py-8 shadow-[0_24px_70px_-28px_rgba(92,57,32,0.35)] backdrop-blur sm:px-12 sm:py-10">
        <div className="text-center">
          <img
            src="/logo2.png"
            alt="Tana Cafe"
            className="mx-auto h-24 w-24 object-contain sm:h-28 sm:w-28"
          />
          <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#733313] sm:text-4xl">
            Tana Cafe
          </p>
          <p className="mt-1 text-xs font-medium tracking-[0.2em] text-[#8b5b45]">
            GOOD FOOD <span className="px-2 text-[#ed6b16]">•</span> BETTER MOOD
          </p>
          <h1 className="mt-9 text-4xl font-bold tracking-tight text-[#2b1210] sm:text-5xl">
            {userLogin ? (
              <>
                Welcome <span className="text-[#f36b18]">Back!</span>
              </>
            ) : (
              <>
                Create <span className="text-[#f36b18]">Account</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-base text-slate-500 sm:text-lg">
            {userLogin
              ? "Sign in to your account to continue"
              : "Join us for a better dining experience"}
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
          {!userLogin && (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#321818]">
                Name
              </span>
              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[#2b1210] shadow-sm focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#321818]">
              <MdEmail className="text-lg text-[#ff6b16]" />
              Email
            </span>
            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[#2b1210] shadow-sm focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#321818]">
              <FaLock className="text-base text-[#ff6b16]" />
              Password
            </span>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-[#2b1210] shadow-sm focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f36b18]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          {!userLogin && (
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#321818]">
                <FaLock className="text-base text-[#ff6b16]" />
                Confirm Password
              </span>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[#2b1210] shadow-sm focus:border-[#f36b18] focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </label>
          )}

          {userLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" className="h-4 w-4 accent-[#f36b18]" />
                Remember me
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info("Password reset is not available yet.")
                }
                className="font-medium text-[#ed5e13] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#ff7817] to-[#f45f0c] text-lg font-bold text-white shadow-[0_10px_24px_-10px_rgba(245,95,12,0.8)] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <FiLogIn className="text-xl" />
            {userLogin ? "Sign In" : "Create Account"}
          </button>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div
            ref={googleButtonRef}
            className="flex min-h-13 w-full items-center justify-center overflow-hidden rounded-xl [&>div]:!w-full"
          />
          {!googleReady && (
            <button
              type="button"
              onClick={() =>
                toast.info("Google sign-in is still loading. Please try again.")
              }
              className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FaGoogle className="text-lg text-[#4285f4]" />
              Sign in with Google
            </button>
          )}

          <p className="pt-2 text-center text-sm text-slate-500">
            {userLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setUserLogin((prev) => !prev)}
              className="font-semibold text-[#ed5e13] hover:underline"
            >
              {userLogin ? "Create account" : "Sign in"}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
