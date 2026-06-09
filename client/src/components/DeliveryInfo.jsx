import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

// Orgofresh warehouse location (Tezpur example)
const WAREHOUSE = {
  lat: 26.6528,
  lon: 92.7926
};

const DeliveryInfo = () => {

  const { location, setLocation, deliveryFee, setDeliveryFee, serviceAvailable, setServiceAvailable } = useAppContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("30 minutes");

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const applyDeliveryLogic = (distance) => {
    if (distance <= 5) {
      setDeliveryTime("15 minutes");
      setDeliveryFee(0);
      setServiceAvailable(true);
    } 
    else if (distance <= 15) {
      setDeliveryTime("30 minutes");
      setDeliveryFee(20);
      setServiceAvailable(true);
    } 
    else if (distance <= 25) {
      setDeliveryTime("45 minutes");
      setDeliveryFee(40);
      setServiceAvailable(true);
    } 
    else {
      setServiceAvailable(false);
      setDeliveryTime("Not Deliverable");
      setDeliveryFee(0);
    }
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const distance = getDistance(
          WAREHOUSE.lat,
          WAREHOUSE.lon,
          latitude,
          longitude
        );

        applyDeliveryLogic(distance);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.municipality ||
            data.address.county ||
            data.address.suburb ||
            data.address.state_district ||
            "Unknown Area";

          const state = data.address.state || "";
          setLocation(`${city}, ${state}`);

        } catch (error) {
          alert("Unable to fetch location");
        }

        setLoading(false);
        setOpen(false);
      },
      () => {
        alert("Permission denied");
        setLoading(false);
      }
    );
  };

  const handleSave = async () => {
    if (input.length !== 6) {
      alert("Enter valid 6-digit PIN code");
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${input}&country=India&format=json`
      );

      const data = await res.json();

      if (data.length > 0) {
        const addressParts = data[0].display_name.split(",");
        const city = addressParts[0];
        const state = addressParts[addressParts.length - 3];
        setLocation(`${city}, ${state}`);

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        const distance = getDistance(
          WAREHOUSE.lat,
          WAREHOUSE.lon,
          lat,
          lon
        );

        applyDeliveryLogic(distance);

        setOpen(false);
        setInput("");
      } else {
        alert("PIN code not found");
      }
    } catch (error) {
      alert("Error detecting location");
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex flex-col leading-tight cursor-pointer"
      >
        <span className="text-sm font-semibold">
          Delivery in <span className="text-green-600">{deliveryTime}</span>
        </span>

        <span className="text-xs text-gray-500">
          📍 {location}
        </span>

        {serviceAvailable ? (
          <span className="text-xs text-gray-500">
            🚚 Delivery Fee: ₹{deliveryFee}
          </span>
        ) : (
          <span className="text-xs text-red-500 font-semibold">
            Service not available in your area
          </span>
        )}
      </div>

      {open && (
        <div className="absolute top-12 left-0 bg-white shadow-xl border border-gray-200 p-4 rounded-lg w-72 z-50">
          <p className="text-sm font-medium mb-3">
            Change Delivery Location
          </p>

          <button
            onClick={detectLocation}
            className="w-full bg-purple-400 text-white py-2 rounded mb-3 hover:bg-purple-600 transition text-sm"
          >
            {loading ? "Detecting..." : "📍 Detect My Location"}
          </button>

          <input
            type="text"
            placeholder="Enter PIN Code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-violet-500"
          />

          <button
            onClick={handleSave}
            className="mt-3 w-full bg-violet-500 text-white py-2 rounded hover:bg-violet-600 transition text-sm"
          >
            Save Location
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;