import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeCartItem,
    updateCartItem,
    axios,
    user,
    setCartItems,
    deliveryFee,
    serviceAvailable,
    setShowUserLogin,
  } = useAppContext();

  const [showAddress, setShowAddress]       = useState(false);
  const [addresses, setAddresses]           = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption]   = useState("COD");
  const navigate = useNavigate();

  const validItems = cartItems.filter(
    (item) =>
      item.option &&
      item.option.value !== undefined &&
      item.option.price !== undefined
  );

  // ── Get user addresses ───────────────────────────────────────────────────────
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  // ── Guard: require login ─────────────────────────────────────────────────────
  const requireLogin = (action) => {
    if (!user) {
      toast.error("Please login or signup to proceed", {
        icon: "🔐",
        duration: 3000,
      });
      setShowUserLogin(true);
      return false;
    }
    return true;
  };

  // ── Navigate to add address with login check ─────────────────────────────────
  const handleAddAddress = () => {
    if (!requireLogin()) return;
    navigate("/add-address");
  };

  // ── Place order ──────────────────────────────────────────────────────────────
  const placeOrder = async () => {
    if (!requireLogin()) return;

    if (!serviceAvailable) {
      return toast.error("Delivery not available in your area");
    }

    if (!selectedAddress) {
      return toast.error("Please select a delivery address");
    }

    try {
      const orderData = {
        items: validItems.map((item) => ({
          product:  item.product,
          quantity: item.quantity,
          option:   item.option,
        })),
        address: selectedAddress._id,
      };

      // COD
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", orderData);
        if (data.success) {
          toast.success(data.message);
          setCartItems([]);
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }

      // Stripe
      else if (paymentOption === "Stripe") {
        const { data } = await axios.post("/api/order/stripe", orderData);
        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }

      // Razorpay
      else if (paymentOption === "Razorpay") {
        const { data } = await axios.post("/api/order/razorpay", orderData);
        if (!data.success) return toast.error(data.message);
        const logoUrl = import.meta.env.VITE_LOGO_url || `${window.location.origin}/logofavi.svg`;

        const options = {
          key:         data.key,
          amount:      data.order.amount,
          currency:    "INR",
          name:        "Orgofresh",
          description: "Fresh Grocery Order 🥬",
          image:       logoUrl,         
          order_id:    data.order.id,
          handler: async (response) => {
            const verifyRes = await axios.post("/api/order/razorpay/verify", {
              ...response,
              dbOrderId: data.dbOrderId,
            });
            if (verifyRes.data.success) {
              toast.success("Payment Successful 🎉");
              setCartItems([]);
              navigate("/my-orders");
            } else {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            // Pre-fill customer name & email if available
            name:  selectedAddress?.firstName
              ? `${selectedAddress.firstName} ${selectedAddress.lastName}`
              : "",
            email: selectedAddress?.email || "",
            contact: selectedAddress?.phone || "",
          },
          theme: { color: "#16A34A" },
        };

        if (!window.Razorpay) {
          return toast.error("Razorpay SDK failed to load. Please refresh.");
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const cartTotal = validItems.reduce(
    (acc, item) => acc + item.option.price * item.quantity,
    0
  );

  if (!products.length || !cartItems) return null;

  return (
    <div className="flex flex-col md:flex-row mt-16">

      {/* ── Left: Cart items ── */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-yellow-500">
            {validItems.length} items
          </span>
        </h1>

        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {validItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
            <button
              onClick={() => { navigate("/products"); scrollTo(0, 0); }}
              className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          validItems.map((item) => (
            <div
              key={`${item.product}-${item.option?.value}-${item.option?.unit}`}
              className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr] text-gray-500 text-sm md:text-base font-medium pt-4 border-b pb-4"
            >
              {/* Product info */}
              <div className="flex items-center md:gap-6 gap-3">
                {item.image && (
                  <img
                    className="w-20 h-20 object-cover rounded"
                    src={item.image} alt=""
                  />
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.option?.value}{item.option?.unit}
                  </p>
                  <p className="text-xs text-green-600">
                    ₹{item.option?.price} per {item.option?.unit}
                  </p>
                </div>
              </div>

              {/* Subtotal */}
              <p className="text-center mt-2 md:mt-0">
                ₹{(item.option?.price || 0) * item.quantity}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 mt-2 md:mt-0">
                <button
                  onClick={() => updateCartItem(item.product, item.option, "dec")}
                  className="px-3 py-1 border rounded"
                >−</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateCartItem(item.product, item.option, "inc")}
                  className="px-3 py-1 border rounded bg-green-500 text-white"
                >+</button>
                <button
                  onClick={() => removeCartItem(item.product, item.option)}
                  className="text-red-500"
                >✕</button>
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => { navigate("/products"); scrollTo(0, 0); }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-yellow-500 font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored} alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* ── Right: Order summary ── */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        {/* Delivery address */}
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>

          {/* Not logged in — show login prompt */}
          {!user ? (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 font-medium mb-2">
                🔐 Login required to checkout
              </p>
              <button
                onClick={() => {
                  toast.error("Please login or signup to proceed", { icon: "🔐" });
                  setShowUserLogin(true);
                }}
                className="w-full py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition"
              >
                Login / Sign Up
              </button>
            </div>
          ) : (
            <div className="relative flex justify-between items-start mt-2">
              <p className="text-gray-500">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                  : "No address found"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-yellow-500 hover:underline cursor-pointer ml-2 flex-shrink-0"
              >
                Change
              </button>

              {/* Address dropdown */}
              {showAddress && (
                <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10 rounded-lg shadow-lg">
                  {addresses.map((address, index) => (
                    <p
                      key={address._id || index}
                      onClick={() => { setSelectedAddress(address); setShowAddress(false); }}
                      className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {address.street}, {address.city}, {address.state},{" "}
                      {address.country}
                    </p>
                  ))}

                  {/* ✅ FIXED: Add address with login check */}
                  <p
                    onClick={() => { setShowAddress(false); handleAddAddress(); }}
                    className="text-yellow-500 text-center cursor-pointer p-2 hover:bg-yellow-50 font-medium border-t"
                  >
                    + Add New Address
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Payment method */}
          {user && (
            <>
              <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
              <select
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none rounded"
              >
                <option value="COD">Cash On Delivery</option>
                <option value="Stripe">Stripe (Card / Google Pay)</option>
                <option value="Razorpay">Razorpay (UPI / PhonePe / Paytm)</option>
              </select>
            </>
          )}
        </div>

        <hr className="border-gray-300" />

        {/* Price breakdown */}
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency}{cartTotal}</span>
          </p>
          <p className="flex justify-between">
            <span>Delivery Fee</span>
            {deliveryFee === 0 ? (
              <span className="text-yellow-500">Free</span>
            ) : (
              <span>{currency}{deliveryFee}</span>
            )}
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>{currency}{(((cartTotal + deliveryFee) * 2) / 100).toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3 text-gray-800">
            <span>Total Amount:</span>
            <span>
              {currency}
              {(cartTotal + deliveryFee + ((cartTotal + deliveryFee) * 2) / 100).toFixed(2)}
            </span>
          </p>
        </div>

        {/* Place order button */}
        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition rounded"
        >
          {!user
            ? "Login to Checkout"
            : paymentOption === "COD"
            ? "Place Order"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
