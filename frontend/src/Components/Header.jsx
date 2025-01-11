import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Header Bar */}
      <div className="flex justify-between items-center p-4 text-[15px] md:text-[20px] font-serif bg-blue-100 sticky top-0 h-[80px] z-50 shadow-md">
        <div className="text-2xl font-bold text-blue-700 ml-4">
          Waste Classifier
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 mr-10">
          <Link to="/home" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/post" className="hover:text-blue-600 transition">
            Post
          </Link>
          <Link to="/allWaste" className="hover:text-blue-600 transition">
            All Waste
          </Link>
          <Link to="/upload" className="hover:text-blue-600 transition">
            Check Waste
          </Link>
          <Link to="/map" className="hover:text-blue-600 transition">
            Map
          </Link>
          <Link to="/" className="hover:text-blue-600 transition">
            LogOut
          </Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden mr-4">
          <button
            onClick={toggleMenu}
            className="text-blue-700 focus:outline-none"
          >
            {isMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed inset-y-0 left-0 bg-blue-100 w-3/4 max-w-xs transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 shadow-lg`}
      >
        <div className="p-4 z-50">
          <div className="text-lg font-bold text-blue-700 mb-6">Navigation</div>
          <div className="flex flex-col gap-10 mt-[50px] z-50">
            <Link
              to="/home"
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/post"
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={toggleMenu}
            >
              Post
            </Link>
            <Link
              to="/allWaste"
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={toggleMenu}
            >
              All Waste
            </Link>
            <Link
              to="/upload"
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={toggleMenu}
            >
              Check Waste
            </Link>
            <Link
              to="/map"
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={toggleMenu}
            >
              Map
            </Link>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 transition"
              onClick={toggleMenu}
            >
              LogOut
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop for Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default Header;
