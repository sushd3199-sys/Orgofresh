
import React from "react";
import { motion } from "framer-motion";
import { Truck, Clock, ShieldCheck, Leaf, MapPin, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Infodelivery = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-[linear-gradient(to_bottom,_#fefce8,_#fff7ed,_#ffffff)]">
     
      <div className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-800"
        >
          Fast. Fresh. Reliable.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-gray-600 max-w-2xl mx-auto"
        >
          Experience seamless grocery delivery with farm-fresh products
          delivered safely to your doorstep.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate("/products")}
          className="mt-8 px-8 py-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 hover:scale-105 transition duration-300"
        >
          Start Shopping
        </motion.button>
      </div>

      {/* Cards Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16 lg:px-24 pb-20 ">
      
        {[
          {
            icon: MapPin,
            title: "Delivery Areas",
            text: "Serving Tezpur and nearby areas with expanding coverage.",
          },
          {
            icon: Clock,
            title: "Flexible Timings",
            text: "Same-day delivery available with convenient time slots.",
          },
          {
            icon: Wallet,
            title: "Affordable Charges",
            text: "Free delivery above ₹499 with no hidden fees.",
          },
          {
            icon: Leaf,
            title: "Freshness Guarantee",
            text: "Quality-checked produce packed fresh before dispatch.",
          },
          {
            icon: ShieldCheck,
            title: "Safe & Hygienic",
            text: "Contactless delivery with hygienic packaging.",
          },
          {
            icon: Truck,
            title: "Express Delivery",
            text: "30–60 minute delivery in selected areas.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl shadow-lg p-8 border border-yellow-100 
bg-[linear-gradient(to_right,_#ffffff,_#fefce8)]
hover:bg-[linear-gradient(to_right,_#fde68a,_#facc15,_#fde68a)]
hover:shadow-2xl hover:-translate-y-2 
transition-all duration-500 cursor-pointer"
          >
            <item.icon className="text-yellow-600 mb-4" size={36} />
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-600">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Infodelivery;
