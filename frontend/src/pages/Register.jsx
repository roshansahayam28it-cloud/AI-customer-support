import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }
      );

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Registration Failed"
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#08011d] relative overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[180px] opacity-20"></div>

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

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white tracking-wide">
            AI SUPPORTER
          </h1>

          <p className="text-gray-300 text-sm mt-2">
            Intelligent Customer Support
          </p>

        </div>

        <h2 className="text-center text-white text-2xl font-semibold mb-8">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          >
            <option value="Customer">
              Customer
            </option>

            <option value="Agent">
              Agent
            </option>
          </select>

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
            "
          >
            Register Now
          </button>

        </form>

        <p
          className="
          text-center
          text-gray-300
          mt-6
          text-sm
          "
        >
          Already have an account?

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
            Login
          </span>

        </p>

      </div>

    </div>

  );
}

export default Register;