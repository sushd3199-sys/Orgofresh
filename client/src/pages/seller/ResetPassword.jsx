import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { axios } = useAppContext();
  const { token } = useParams();
  const navigate = useNavigate(); // ✅ add this

  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const { data } = await axios.post("/api/seller/reset-password", {
      token,
      password,
    });

    if (data.success) {
      toast.success("Password reset successful");

      // ✅ REDIRECT AFTER 1.5 sec
      setTimeout(() => {
        navigate("/seller");
      }, 1500);

    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password 🔐
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;