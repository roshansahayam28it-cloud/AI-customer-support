import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOTP() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/auth/verify-otp",
        {
          email: localStorage.getItem(
            "reset_email"
          ),
          otp
        }
      );

      alert("OTP Verified Successfully");

      navigate("/reset-password");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Invalid OTP"
      );

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08011d]">

      <div className="w-[380px] p-8 rounded-[30px] bg-white/10 backdrop-blur-xl border border-purple-500/40 shadow-[0_0_35px_rgba(168,85,247,0.45)]">

        <h1 className="text-4xl font-bold text-center text-white">
          AI SUPPORTER
        </h1>

        <p className="text-center text-gray-300 mt-2">
          Verify Your OTP
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          />

          <button
            type="submit"
            className="h-[52px] rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
          >
            Verify OTP
          </button>

        </form>

      </div>

    </div>
  );
}

export default VerifyOTP;