import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/img/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const Navbar = ({ isLoggedIn = false, user = null }) => {
  const [expanded, setExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  const logoutUser = async () => {
    try {
      setIsLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const onLogoutClick = async (e) => {
    e.preventDefault();
    await logoutUser();
  };

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
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
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <header className="relative z-50 py-4 sm:py-6 bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            {isLoggedIn ? (
              <Link to="/home" className="flex items-center space-x-3">
                <img className="w-auto h-9" src={logo} alt="Flashly Logo" />
                <span className="text-2xl font-bold text-white">Flashly</span>
              </Link>
            ) : (
              <Link to="/" className="flex items-center space-x-3">
                <img className="w-auto h-9" src={logo} alt="Flashly Logo" />
                <span className="text-2xl font-bold text-white">Flashly</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
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

          {/* Desktop Navigation */}
          {isLoggedIn ? (
            /* Logged in user navigation */
            <nav className="hidden md:flex md:items-center md:justify-end md:space-x-8">
              {/* Navigation Links */}
              <Link
                to="/home"
                className="text-base font-normal text-gray-300 transition-all duration-200 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/home/generate"
                className="text-base font-normal text-gray-300 transition-all duration-200 hover:text-white"
              >
                Generate
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-gray-800"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.username || "User"}
                      />
                      <AvatarFallback className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-lg bg-gray-800 border-gray-700"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.username || "User"}
                        />
                        <AvatarFallback className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                          {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-white">
                          {user?.username || "User"}
                        </span>
                        <span className="truncate text-xs text-gray-400">
                          {user?.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-gray-700" />

                  <DropdownMenuItem
                    onClick={onLogoutClick}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          ) : (
            /* Guest user navigation */
            <nav className="hidden md:flex md:items-center md:justify-end md:space-x-8">
              <Link
                to="/login"
                className="text-base font-normal text-gray-300 transition-all duration-200 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-2.5 text-base font-medium text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900"
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>

        {/* Mobile Navigation */}
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
                {isLoggedIn ? (
                  /* Mobile logged in navigation */
                  <>
                    {/* User Info */}
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-3 pb-4 border-b border-gray-700 w-full justify-center"
                    >
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.username || "User"}
                        />
                        <AvatarFallback className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                          {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="font-semibold text-white">
                          {user?.username || "User"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user?.email || "No email"}
                        </div>
                      </div>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/home"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-300 transition-all duration-200 border-2 border-gray-600 rounded-full hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 focus:ring-offset-gray-900"
                      >
                        Dashboard
                      </Link>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/home/generate"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900"
                      >
                        Generate
                      </Link>
                    </motion.div>

                    {/* Logout Button */}
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={onLogoutClick}
                        disabled={isLoggingOut}
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-red-400 transition-all duration-200 border-2 border-red-600 rounded-full hover:text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoggingOut ? "Logging out..." : "Log out"}
                      </button>
                    </motion.div>
                  </>
                ) : (
                  /* Mobile guest navigation */
                  <>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
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
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
