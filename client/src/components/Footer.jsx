import React from "react";
import { Link } from "react-router-dom";
import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-linear-to-r from-gray-100 via-yellow-300 to-gray-200 border-gray-200">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-600">
        <div>
          <img className="w-34 md:w-32" src={assets.logofavi} alt="logofavi" />
          <p className="max-w-[410px] mt-6">
            We bring you naturally grown, chemical-free produce sourced directly
            from local farmers. Pure, safe, and truly fresh—just the way nature
            intended.
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.url.startsWith("http") ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-yellow-600 transition"
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="hover:text-yellow-600 transition"
                      >
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-gray-700/80">
        Copyright {new Date().getFullYear()} © Orgofresh.in | All Right
        Reserved.
      </p>
    </div>
  );
};

export default Footer;
