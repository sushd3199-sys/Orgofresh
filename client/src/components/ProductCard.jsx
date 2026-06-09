import React from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const ProductCard = ({ product }) => {
  const { currency } = useAppContext();
  const navigate = useNavigate();
  const option = product.quantityOptions?.[0];
  const [qty, setQty] = useState(0);
  const { addToCart, updateCartItem } = useAppContext();

let discount = 0;
if (option?.originalPrice) {
  discount = Math.round(
    ((option.originalPrice - option.price) / option.originalPrice) * 100
  );
}
  return (
    <Link
      to={`/products/${product.category.toLowerCase()}/${product._id}`}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition w-full max-w-[180px] block"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg bg-gray-50">
        {/* DISCOUNT BADGE */}
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded">
        {discount}% OFF
        </span>

        <img
          src={product.image[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="px-2 py-2">
        {/* DELIVERY TIME */}
        <p className="text-[11px] text-gray-500 flex items-center gap-1">
          ⏱ 25 MINS
        </p>

        {/* PRODUCT NAME */}
        <p className="text-sm font-medium leading-tight line-clamp-2">
          {product.name}
        </p>

        {/* WEIGHT (optional if you have) */}
        <p className="text-xs text-gray-500">
  {option?.value}{option?.unit}
</p>

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-semibold text-sm">
              {currency}{option?.price}
            </span>
          </div>

          {qty === 0 ? (
  <button
    onClick={(e) => {
      e.preventDefault();
      if (!option) return;
      addToCart(product, option);
      setQty(1);
    }}
    className="border border-green-600 text-green-600 text-xs px-3 py-1 rounded-md font-semibold"
  >
    ADD
  </button>
) : (
  <div className="flex items-center gap-2 border border-green-600 px-2 rounded-md">
    <button
      onClick={(e) => {
        e.preventDefault();
        updateCartItem(product._id, option, "dec");
        setQty(qty - 1);
      }}
    >
      -
    </button>

    <span className="text-sm">{qty}</span>

    <button
      onClick={(e) => {
        e.preventDefault();
        updateCartItem(product._id, option, "inc");
        setQty(qty + 1);
      }}
    >
      +
    </button>
  </div>
)}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
