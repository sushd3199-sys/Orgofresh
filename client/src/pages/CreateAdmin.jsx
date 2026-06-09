import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CreateAdmin = () => {
  const { axios } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/api/seller/create-admin", form);

      if (data.success) {
        toast.success("Admin created successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Admin</h2>

      <input
        placeholder="Name"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Admin
      </button>
    </div>
  );
};

export default CreateAdmin;