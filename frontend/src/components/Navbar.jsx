import React, { useState } from "react";
import Logo from "../assets/images/logo.svg";
import { FaAlignJustify, FaTimes } from "react-icons/fa";
import { IoMoon, IoSunny } from "react-icons/io5";

const Navbar = ({ dark, setDark }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between p-5 items-center bg-white shadow-md dark:bg-gray-900 dark:shadow-xl">
        {/* Logo */}
        <div className="logo">
          <a href="/" className="flex items-center gap-4">
            <img
              src={Logo}
              alt="Flashly Logo"
              className="w-8 max-w-full h-auto block"
            />
            <p className="text-xl font-bold dark:text-secondary">Flashly</p>
          </a>
        </div>

        {/* Desktop Menu (Hidden on Tablets & Small Screens) */}
        <div className="hidden lg:flex gap-6 text-xl">
          <a
            href="/"
            className="hover:text-primary relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary dark:after:bg-secondary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center dark:text-secondary"
          >
            Generate
          </a>
          <a
            href="/myflashcards"
            className="hover:text-primary relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary dark:after:bg-secondary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center dark:text-secondary"
          >
            My Flashcards
          </a>
        </div>

        {/* Action Buttons (Hidden on Tablets & Small Screens) */}
        <div className="hidden lg:flex gap-4">
          <button onClick={() => setDark(!dark)} className="text-2xl">
            {dark ? <IoSunny /> : <IoMoon />}
          </button>
          <button className="bg-transparent hover:bg-primary dark:hover:bg-secondary text-primary font-semibold hover:text-white dark:hover:text-black py-2 px-4 border border-primary dark:border-secondary hover:border-transparent rounded dark:text-secondary">
            Login
          </button>
          <button className="bg-primary hover:bg-red-900 dark:hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded dark:bg-secondary dark:text-black">
            Signup
          </button>
        </div>

        {/* Mobile Menu Button (Now Visible on Tablets & Phones) */}
        <button
          className="lg:hidden dark:bg-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaAlignJustify size={24} />}
        </button>
      </nav>

      {/* Mobile Menu (Shown when `isOpen` is true) */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full dark:bg-gray-900 bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full "
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 text-xl">
          <a
            href="/"
            className="active:text-primary relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary dark:after:bg-secondary after:w-full after:scale-x-0 after:active:scale-x-100 after:transition after:duration-100 after:origin-center dark:text-secondary"
          >
            Generate
          </a>
          <a
            href="/myflashcards"
            className="active:text-primary relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary dark:after:bg-secondary after:w-full after:scale-x-0 after:active:scale-x-100 after:transition after:duration-100 after:origin-center dark:text-secondary"
          >
            My Flashcards
          </a>
          <button className="bg-transparent active:bg-primary dark:active:bg-secondary text-primary dark:active:text-black font-semibold active:text-white py-2 px-6 border border-primary dark:border-secondary active:border-transparent rounded dark:text-secondary">
            Login
          </button>
          <button className="bg-primary active:bg-red-900 dark:active:bg-yellow-500 text-white font-bold py-2 px-6 rounded dark:bg-secondary dark:text-black">
            Signup
          </button>
          <button onClick={() => setDark(!dark)} className="text-2xl">
            {dark ? <IoSunny /> : <IoMoon />}
          </button>
          <button
            className="absolute top-5 right-5"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
