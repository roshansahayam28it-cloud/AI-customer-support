import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FaEnvelope } from "react-icons/fa";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/auth/forgot-password",
        {
          email
        }
      );

      alert(res.data.message);

      localStorage.setItem(
        "reset_email",
        email
      );

      navigate("/verify-otp");

    } catch (error) {

      console.error("Forgot Password Error:", error);

      alert(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#08011d] relative overflow-hidden">

      {/* Background Glow */}
      <div
        className="
        absolute
        w-[500px]
        h-[500px]
        bg-purple-600
        rounded-full
        blur-[180px]
        opacity-20
        "
      ></div>

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
        border
        border-purple-500/40
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
          Forgot Password
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

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
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
              bg-transparent
              w-full
              ml-3
              text-white
              placeholder-gray-300
              outline-none
              "
              required
            />

          </div>

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
            Send Reset Link
          </button>

        </form>

        {/* Back Link */}
        <p
          className="
          text-center
          text-gray-300
          mt-6
          text-sm
          "
        >

          Remember your password?

          <span
            className="
            text-pink-400
            ml-2
            cursor-pointer
            hover:underline
            "
            onClick={() =>
              navigate("/login")
            }
          >
            Back To Login
          </span>

        </p>

      </div>

    </div>

  );

}

export default ForgotPassword;