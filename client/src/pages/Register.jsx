import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
      if (err.response.status == 409){
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    }
  };

  console.log(inputs);

  return (
    <div className=" text-gray-800 min-h-screen flex items-center justify-center bg-[#d4f7eb] px-4 sm:px-6">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-[#b0e3d3]">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 font-heading">
          Create Account
        </h1>
        <p className="text-center text-sm sm:text-base mb-6 font-body">
          Fill in the details to register a new account.
        </p>

        <form  //onSubmit={handleSubmit} 
        className="flex flex-col gap-4 font-body">
          <input
            required
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="Username"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <input
            required
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <input
            required
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <button
            name="button"
            onClick={handleSubmit}
            type="submit"
            className="bg-[#3fcd9d] hover:bg-[#35c090] py-2 rounded-lg font-semibold transition-all"
          >
            Register
          </button>
          {err && <p className="text-red-800 text-center italic">{err}</p>}
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-gray-900 underline hover:text-teal-700 transition-all"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
