import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/img/logo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for menu items
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <header className="relative z-50 py-4 sm:py-6 bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="shrink-0">
            <Link to="/" title="" className="flex items-center space-x-3">
              <img className="w-auto h-9" src={logo} alt="Flashly Logo" />
              <span className="text-2xl font-bold text-white">Flashly</span>
            </Link>
          </div>

          <div className="flex md:hidden">
            <motion.button
              type="button"
              className="text-gray-100"
              onClick={toggleMenu}
              aria-expanded={expanded}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {!expanded ? (
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </motion.button>
          </div>

          <nav className="hidden md:flex md:items-center md:justify-end md:space-x-8">
            <Link
              to="/auth/login"
              className="text-base font-normal text-gray-300 transition-all duration-200 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center px-6 py-2.5 text-base font-medium text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900"
            >
              Sign Up
            </Link>
          </nav>
        </div>

        {/* Animated Mobile Navigation */}
        <AnimatePresence>
          {expanded && (
            <motion.nav
              className="md:hidden mt-6"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-col items-center space-y-6 py-6">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-300 transition-all duration-200 border-2 border-gray-600 rounded-full hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 focus:ring-offset-gray-900"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/auth/signup"
                    className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
