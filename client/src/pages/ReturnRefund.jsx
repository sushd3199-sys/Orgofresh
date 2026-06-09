import React from "react";
import { motion } from "framer-motion";
import { RotateCcw, AlertCircle, CheckCircle, Wallet } from "lucide-react";

const ReturnRefund = () => {
  const sections = [
    {
      icon: RotateCcw,
      title: "Perishable Items",
      text: "Returns accepted within 24 hours if items are damaged, spoiled, or incorrect. Images required for verification."
    },
    {
      icon: AlertCircle,
      title: "Non-Perishable Items",
      text: "Return within 3 days if unused and in original packaging."
    },
    {
      icon: Wallet,
      title: "Refund Process",
      text: "Refunds processed within 3–5 working days to original payment method or bank/UPI for COD."
    },
    {
      icon: CheckCircle,
      title: "Customer Support",
      text: "Contact support@orgofresh.com or call us for quick resolution."
    }
  ];

  return (
    <div className="bg-[linear-gradient(to_bottom,_#fefce8,_#fff7ed,_#ffffff)]">
    
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-800"
        >
          Return & Refund Policy
        </motion.h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Your satisfaction matters to us. We ensure a smooth and transparent
          return and refund process.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {sections.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl shadow-lg p-8 border border-yellow-100 
bg-[linear-gradient(to_right,_#ffffff,_#fefce8)]
hover:bg-[linear-gradient(to_right,_#fde68a,_#facc15,_#fde68a)]
hover:shadow-2xl hover:-translate-y-2 
transition-all duration-300 cursor-pointer"
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

export default ReturnRefund;