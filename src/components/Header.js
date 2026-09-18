import React, { useState } from "react";
import {RiSearchLine, RiMenuLine, RiCloseLine,} from "react-icons/ri";
import logo from "../Assests/logo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Company Logo */}
          <a href="/" className="flex items-center">
            <img
              src={logo}
              alt="TechNova Solutions"
              className="w-[220px] h-[70px] object-cover object-center"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-base font-medium">

            <a
              href="/"
              className="text-gray-600 border-b-2 hover:text-primary transition pb-1"
            >
              Home
            </a>

            <a
              href="/Features"
              className="text-gray-600 hover:text-primary transition"
            >
              Features
            </a>

            <a
              href="/About"
              className="text-gray-600 hover:text-primary transition"
            >
              About
            </a>

            <a
              href="/Contact"
              className="text-gray-600 hover:text-primary transition"
            >
              Contact
            </a>

          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">

            <button
              className="text-2xl text-gray-600 hover:text-primary transition"
            >
              <RiSearchLine />
            </button>

            <button
              onClick={handleLogin}
              className="px-4 lg:px-5 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
            >
              Login
            </button>

            <button
              onClick={handleLogin}
              className="px-4 lg:px-5 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              Get Started
            </button>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t pt-4">

            <nav className="flex flex-col gap-4 text-base font-medium">

              <a
                href="/"
                className="text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>

              <a
                href="/Features"
                className="text-gray-600 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>

              <a
                href="/About"
                className="text-gray-600 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>

              <a
                href="/Contact"
                className="text-gray-600 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>

              <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                <RiSearchLine className="text-xl" />
                Search
              </button>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full sm:w-auto px-5 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full sm:w-auto px-5 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Get Started
                </button>

              </div>

            </nav>

          </div>
        )}
      </div>
    </header>
  );
};

export default Header;