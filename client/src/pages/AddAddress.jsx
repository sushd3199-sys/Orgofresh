import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-600 focus:border-green-500 transition text-sm"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, user, setShowUserLogin } = useAppContext();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    firstName:  "",
    lastName:   "",
    email:      "",
    street:     "",
    landmark:   "",
    city:       "",
    state:      "",
    zipcode:    "",
    country:    "",
    phone:      "",
  });

  // ✅ FIXED: was navigating to /login which doesn't exist as a route
  // Now shows toast + opens login modal + stays on cart page
  useEffect(() => {
    if (!user) {
      toast.error("Please login or signup to add an address", {
        icon: "🔐",
        duration: 3000,
      });
      setShowUserLogin(true);
      navigate("/cart");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", address);
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Don't render anything if not logged in — will redirect via useEffect
  if (!user) return null;

  return (
    <div className="mt-12 pb-16" style={{ fontFamily: "'Outfit', 'Roboto', sans-serif" }}>

      {/* Header */}
      <div className="mb-8">
        <p style={{
          fontSize: 12, fontWeight: 700, color: "#16A34A",
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6,
        }}>
          Checkout
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Add Shipping <span style={{ color: "#16A34A" }}>Address</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in your delivery details below
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between gap-10">

        {/* ── Form ── */}
        <div className="flex-1 max-w-lg">
          <form onSubmit={onSubmitHandler} className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                  First Name
                </label>
                <InputField handleChange={handleChange} address={address}
                  name="firstName" type="text" placeholder="Rahul" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                  Last Name
                </label>
                <InputField handleChange={handleChange} address={address}
                  name="lastName" type="text" placeholder="Sharma" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Email Address
              </label>
              <InputField handleChange={handleChange} address={address}
                name="email" type="email" placeholder="rahul@email.com" />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Phone Number
              </label>
              <InputField handleChange={handleChange} address={address}
                name="phone" type="text" placeholder="+91 9XXXXXXXXX" />
            </div>

            {/* Street */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Street Address
              </label>
              <InputField handleChange={handleChange} address={address}
                name="street" type="text" placeholder="House No, Street Name" />
            </div>

            {/* Landmark */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Landmark <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <InputField handleChange={handleChange} address={address}
                name="landmark" type="text" placeholder="Near temple, school etc." />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">City</label>
                <InputField handleChange={handleChange} address={address}
                  name="city" type="text" placeholder="Tezpur" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">State</label>
                <InputField handleChange={handleChange} address={address}
                  name="state" type="text" placeholder="Assam" />
              </div>
            </div>

            {/* Zipcode + Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">ZIP Code</label>
                <InputField handleChange={handleChange} address={address}
                  name="zipcode" type="number" placeholder="784001" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Country</label>
                <InputField handleChange={handleChange} address={address}
                  name="country" type="text" placeholder="India" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
              >
                ← Back to Cart
              </button>
              <button
                type="submit"
                className="flex-1 py-3 text-white rounded-lg font-semibold transition text-sm"
                style={{
                  background: "linear-gradient(135deg, #16A34A, #22C55E)",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                }}
              >
                Save Address →
              </button>
            </div>

          </form>
        </div>

        {/* ── Illustration ── */}
        <div className="md:flex hidden items-center justify-center">
          <img
            src={assets.add_address_iamge}
            alt="Add Address"
            className="max-w-xs opacity-90"
          />
        </div>

      </div>
    </div>
  );
};

export default AddAddress;
