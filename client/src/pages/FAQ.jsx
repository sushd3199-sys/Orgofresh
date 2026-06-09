import React, { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "You can track your order by visiting the 'Track Order' page and entering your Order ID."
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 24 hours for damaged or incorrect items."
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, refunds are processed within 5–7 working days after approval."
    },
    {
      question: "Which payment methods are accepted?",
      answer:
        "We accept Cash on Delivery, Stripe, and Razorpay (UPI, GPay, PhonePe, etc)."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-md"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full text-left px-4 py-3 font-medium bg-gray-50 hover:bg-gray-100"
            >
              {item.question}
            </button>

            {openIndex === index && (
              <div className="px-4 py-3 text-gray-600 bg-white">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;