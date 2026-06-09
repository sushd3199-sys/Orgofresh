import React, { useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const PaymentMethods = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Are online payments secure?",
      answer:
        "Yes. All payments are encrypted and processed securely using trusted payment gateways like Stripe.",
    },
    {
      question: "Can I pay using UPI?",
      answer:
        "Yes. We support UPI payments via Google Pay, PhonePe, Paytm and other UPI-enabled apps.",
    },
    {
      question: "Is Cash on Delivery available?",
      answer:
        "Yes, Cash on Delivery is available for eligible orders and selected locations.",
    },
    {
      question: "How long do refunds take?",
      answer: "Refunds are processed within 3–5 working days after approval.",
    },
  ];

  const methods = [
    {
      icon: CreditCard,
      title: "Credit & Debit Cards",
      text: "Secure card payments powered by Stripe. Supports Visa, MasterCard, RuPay and more.",
    },
    {
      icon: Smartphone,
      title: "UPI Payments",
      text: "Instant payments using Google Pay, PhonePe, Paytm or any UPI app.",
    },
    {
      icon: Banknote,
      title: "Cash on Delivery",
      text: "Pay at your doorstep in cash for selected orders.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Encryption",
      text: "Your transactions are protected with industry-standard SSL encryption.",
    },
  ];
  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-24 py-20 bg-[linear-gradient(to_bottom,_#fefce8,_#fff7ed,_#ffffff)]">
      
      {/* Hero */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-800"
        >
          Secure & Flexible Payments
        </motion.h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Choose your preferred payment method and enjoy a smooth checkout experience.
        </p>
      </div>
  
      {/* Payment Methods */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {methods.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 shadow-lg transition duration-300 
            bg-[linear-gradient(to_right,_#fef9c3,_#fde68a)]
            hover:shadow-2xl hover:-translate-y-2"
          >
            <item.icon className="text-yellow-600 mb-4" size={36} />
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {item.title}
            </h3>
            <p className="text-gray-600">{item.text}</p>
          </motion.div>
        ))}
      </div>
  
      {/* Brand Logos */}
      <div className="text-center mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">
          We Accept
        </h2>
  
        <div className="flex flex-wrap justify-center items-center gap-10">
          <img src={assets.visa_icon} className="h-10 transition hover:scale-110" />
          <img src={assets.rupay_icon} className="h-10 transition hover:scale-110" />
          <img src={assets.amazon_pay_icon} className="h-10 transition hover:scale-110" />
          <img src={assets.gpay_icon} className="h-10 transition hover:scale-110" />
          <img src={assets.phonepe_icon} className="h-10 transition hover:scale-110" />
          <img src={assets.paytm_icon} className="h-10 transition hover:scale-110" />
        </div>
      </div>
  
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
          Payment FAQs
        </h2>
  
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 rounded-2xl overflow-hidden shadow-md">
            
            <button
  onClick={() => setOpenIndex(openIndex === index ? null : index)}
  className={`w-full flex justify-between items-center p-5 transition-all duration-300 cursor-pointer
  ${
    openIndex === index
      ? "bg-[linear-gradient(to_right,_#fde68a,_#facc15,_#fde68a)]"
      : "bg-[linear-gradient(to_right,_#fefce8,_#ffffff)]"
  }`}
>
              <span className="font-medium text-left text-gray-800">
                {faq.question}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
  
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 p-5" : "max-h-0"
              } bg-[linear-gradient(to_right,_#fff7ed,_#fef3c7,_#fff7ed)] text-gray-700`}
            >
              {openIndex === index && faq.answer}
            </div>
  
          </div>
        ))}
      </div>
  
      {/* Trust Section */}
      <div className="mt-20 text-center rounded-3xl p-10 shadow-lg
        bg-[linear-gradient(to_right,_#fde68a,_#facc15,_#fde68a)]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Powered by Trusted Payment Technology
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          We use secure and globally trusted payment infrastructure to ensure
          your transactions are safe, fast and reliable.
        </p>
      </div>
  
    </div>
  );
}
export default PaymentMethods;
