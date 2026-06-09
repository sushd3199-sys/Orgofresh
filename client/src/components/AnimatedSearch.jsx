import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const words = [
  "Apple",
  "Banana",
  "Mango",
  "Almond Milk",
  "Oats Milk",
  "Millet Milk",
  "Soy Milk",
  "Rice Milk",
  "Organic Noodles",
  "Organic Bread",
  "Fresh Vegetables",
  "Fresh Fruits"
];

const AnimatedSearch = () => {
  const { setSearchQuery } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setCurrentIndex((prev) =>
          prev === words.length - 1 ? 0 : prev + 1
        );
        setAnimate(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm focus-within:border-green-500 transition">

        <input
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${words[currentIndex]}...`}
          className={`w-full outline-none bg-transparent text-sm transition-all duration-300 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        />

        <img
          src={assets.search_icon}
          alt="search"
          className="w-4 h-4 opacity-70"
        />
      </div>
    </div>
  );
};

export default AnimatedSearch;

