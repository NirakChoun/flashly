import React, { useState } from "react";
import logo from "../assets/images/logo.svg";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { NavUser } from "./ui/nav-user";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

const Navbar = ({ isLanding = false }) => {
  return (
    <header className="py-4 px-6">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="Flashly logo" className="h-8 w-auto" />
          <h2 className="text-xl font-semibold font-poppins text-gold">
            Flashly
          </h2>
        </Link>

        {/* Desktop Navigation */}
        {!isLanding && (
          <>
            {/* Center nav links - only visible on desktop */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8">
              <Link to="/dashboard" className="font-bold">
                Dashboard
              </Link>
              <Link to="/generate" className="font-bold">
                Generate
              </Link>
            </nav>
            {/* User profile far right - only visible on desktop */}
            <div className="hidden md:flex items-center">
              <NavUser user={user} />
            </div>

            {/* Mobile Menu - only visible on mobile */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-80 bg-matte-black border-matte-black p-0"
                >
                  <div className="flex flex-col gap-6 mt-12 text-white p-6">
                    <Link
                      to="/dashboard"
                      className="font-bold text-lg px-4 py-2 hover:bg-gray-800 rounded-md"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/generate"
                      className="font-bold text-lg px-4 py-2 hover:bg-gray-800 rounded-md"
                    >
                      Generate
                    </Link>

                    <div className="border-t border-gray-700 pt-6 mt-4">
                      <div className="px-4">
                        <NavUser user={user} />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}

        {/* Landing page buttons */}
        {isLanding && (
          <>
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                asChild
                className="bg-transparent cursor-pointer"
                variant="outline"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-400 cursor-pointer"
              >
                <Link to="/signup">Signup</Link>
              </Button>
            </div>

            {/* Mobile menu for landing page */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-80 bg-matte-black border-matte-black p-0"
                >
                  <div className="flex flex-col gap-6 mt-12 text-white p-6">
                    <Button
                      asChild
                      className="w-full border-white text-white hover:bg-gray-800 cursor-pointer"
                      variant="outline"
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-white text-black hover:bg-gray-400 cursor-pointer"
                    >
                      <Link to="/signup">Signup</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
