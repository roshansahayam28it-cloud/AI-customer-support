import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      password !== confirmPassword
    ) {

      alert(
        "Passwords do not match"
      );

      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/auth/reset-password",
        {
          email:
            localStorage.getItem(
              "reset_email"
            ),
          new_password:
            password
        }
      );

      alert(
        "Password Updated Successfully"
      );

      localStorage.removeItem(
        "reset_email"
      );

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed To Reset Password"
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
          Reset Password
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="h-[52px] px-4 rounded-full bg-white/20 text-white outline-none"
          />

          <button
            type="submit"
            className="h-[52px] rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
          >
            Update Password
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;