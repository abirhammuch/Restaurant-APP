import React, { useContext, useEffect, useRef, useState } from "react";
import { FaUser, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
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
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
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
    <div className="flex justify-center items-center mt-12 ">
      <div className="shadow px-29 py-9 rounded-2xl">
        <p className="text-2xl font-bold">
          User{" "}
          <span className="text-orange-500">
            {userLogin ? " Sign In " : "Sign Up"}
          </span>
        </p>

        <form onSubmit={submitHandler} className="mt-6 flex flex-col">
          {userLogin ? (
            ""
          ) : (
            <div className="relative mb-3">
              <p className="text-md mb-2 ">Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Enter your name"
                required
                className="px-9 py-2"
              />
              <FaUser className="absolute bottom-3 left-2 text-gray-600" />
            </div>
          )}

          <div className="relative mb-3">
            <p className="text-md mb-2 ">Email</p>
            <MdEmail className="absolute bottom-3 left-2 text-gray-600" />

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your name"
              required
              className="px-9 py-2"
            />
          </div>

          <div className="relative mb-3">
            <p className="text-md mb-2 ">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              required
              className="px-9 py-2"
            />
            <FaLock className="absolute bottom-3 left-2 text-gray-600" />
          </div>

          {userLogin ? (
            ""
          ) : (
            <div className="relative mb-3">
              <p className="text-md mb-2 "> Confirm Password</p>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                placeholder="Enter your name"
                required
                className="px-9 py-2"
              />
              <FaLock className="absolute bottom-3 left-2 text-gray-600" />
            </div>
          )}

          <div className="mb-4">
            <div ref={googleButtonRef} />
            {!googleReady && (
              <button
                type="button"
                onClick={() => {
                  if (window.google?.accounts?.id) {
                    window.google.accounts.id.prompt();
                  } else {
                    toast.info("Loading Google sign-in...");
                  }
                }}
                className="w-full border border-gray-300 rounded-2xl py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              >
                <FaGoogle /> Continue with Google
              </button>
            )}
          </div>

          <button
            type="submit"
            className="bg-orange-600 text-white py-2 rounded-2xl cursor-pointer hover:bg-orange-700 text-2xl mt-5 mb-3"
          >
            {userLogin ? "Sign In " : "Sign Up"}
          </button>
          {userLogin ? (
            <p className="text-sm text-gray-700 text-center">
              Don't have account?{" "}
              <span
                className="cursor-pointer"
                onClick={() => setUserLogin((prev) => !prev)}
              >
                Create account
              </span>{" "}
            </p>
          ) : (
            <p className="text-sm text-gray-700 text-center">
              Allready have an account?{" "}
              <span
                className="cursor-pointer"
                onClick={() => setUserLogin((prev) => !prev)}
              >
                Sign In
              </span>{" "}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
