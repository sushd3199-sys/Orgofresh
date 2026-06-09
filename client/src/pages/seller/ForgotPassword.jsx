import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";


const ForgotPassword = () => {
  const { axios } = useAppContext();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { data } = await axios.post("/api/seller/forgot-password", {
      email,
    });
  
    if (data.success) {
      toast.success("Reset link sent to your email 📧");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="border p-2 w-full mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="bg-green-500 text-white w-full py-2 rounded">
          Send Reset Token
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;