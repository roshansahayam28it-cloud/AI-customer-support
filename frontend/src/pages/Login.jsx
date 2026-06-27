
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaEnvelope,
  FaLock
} from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: ""
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      const res =
      await axios.post(
        "http://127.0.0.1:8000/auth/login",
        formData
      );

      // Save JWT Token
      localStorage.setItem(
        "token",
        res.data.access_token
      );

      // Save User Details
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role
        })
      );

      alert(
        `Welcome ${res.data.name} 🚀`
      );

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Invalid Credentials"
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#08011d] relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[180px] opacity-20"></div>

      {/* Card */}
      <div
        className="
        relative
        w-[380px]
        px-8
        py-10
        rounded-[30px]
        bg-white/10
        backdrop-blur-xl
        border border-purple-500/40
        shadow-[0_0_35px_rgba(168,85,247,0.45)]
        "
      >

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white tracking-wide">
            AI SUPPORTER
          </h1>

          <p className="text-gray-300 text-sm mt-2">
            Intelligent Customer Support
          </p>

        </div>

        {/* Title */}
        <h2 className="text-center text-white text-2xl font-semibold mb-8">
          Login
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* Email */}
          <div
            className="
            flex items-center
            h-[52px]
            px-4
            rounded-full
            bg-white/20
            "
          >

            <FaEnvelope
              className="
              text-gray-300
              text-sm
              "
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="
              bg-transparent
              w-full
              ml-3
              text-white
              placeholder-gray-300
              outline-none
              "
            />

          </div>

          {/* Password */}
          <div
            className="
            flex items-center
            h-[52px]
            px-4
            rounded-full
            bg-white/20
            "
          >

            <FaLock
              className="
              text-gray-300
              text-sm
              "
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="
              bg-transparent
              w-full
              ml-3
              text-white
              placeholder-gray-300
              outline-none
              "
            />

          </div>

          {/* Button */}
          <button
            type="submit"
            className="
            mt-3
            h-[52px]
            rounded-full
            bg-gradient-to-r
            from-pink-500
            to-purple-600
            text-white
            font-semibold
            hover:scale-105
            transition-all
            duration-300
            shadow-lg
            "
          >
            Login Now
          </button>

        </form>

        {/* Links */}
        <div className="flex justify-between mt-6 text-sm">

          <span
            className="
            text-gray-300
            cursor-pointer
            hover:text-pink-400
            "
            onClick={() =>
              navigate("/forgot-password")
            }
          >
            Forgot Password?
          </span>

          <span
            className="
            text-pink-400
            cursor-pointer
            hover:underline
            "
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </span>

        </div>

      </div>

    </div>

  );
}

export default Login;
