import React from "react";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const {
    userLogin,
    setUserLogin,
    navigate,
    backendUrl,
    usertoken,
    setUsertoken,
    admintoken,
    setAdmintoken,
  } = useContext(AppContext);

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
              placeholder="Enter your name"
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
