// client\src\pages\Login.jsx

import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contextProvider/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { currentUser, login } = useContext(AuthContext);

  console.log(currentUser);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setErr(err.response.data);
      if (err.response.status == 409) {
        setTimeout(() => {
          navigate("/register");
        }, 1000);
      }
    }
  };

  console.log(inputs);

  return (
    <div className="text-gray-800 min-h-screen flex items-center justify-center bg-[#d4f7eb] px-4 sm:px-6">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-[#b0e3d3]   text-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 font-heading">
          Welcome Back
        </h1>
        <p className="text-center text-sm sm:text-base mb-6 font-body">
          Please enter your credentials to login.
        </p>

        <form className="flex flex-col gap-4 font-body">
          <input
            required
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <input
            required
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            name="submit"
            className="bg-[#4bc198] hover:bg-[#3bbd93]  py-2 rounded-lg font-semibold transition-all"
          >
            Login
          </button>
          {err && <p className="text-red-800 text-center italic">{err}</p>}
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-[#0b0c0b] underline hover:text-teal-700 transition-all"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
