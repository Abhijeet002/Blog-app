import React from 'react';

const Register = () => {
  return (
    <div className=" text-gray-800 min-h-screen flex items-center justify-center bg-[#d4f7eb] px-4 sm:px-6">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-[#b0e3d3]">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 font-heading">
          Create Account
        </h1>
        <p className="text-center text-sm sm:text-base mb-6 font-body">
          Fill in the details to register a new account.
        </p>

        <form className="flex flex-col gap-4 font-body">
          <input
            type="text"
            placeholder="Username"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84eac6] transition-all"
          />
          <button
            type="submit"
            className="bg-[#3fcd9d] hover:bg-[#35c090] py-2 rounded-lg font-semibold transition-all"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
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
