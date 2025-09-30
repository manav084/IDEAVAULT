"use client";
import { useState } from "react";
import { Bell, HelpCircle, Menu } from "lucide-react"; // icons
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm rounded-b-2xl px-4 py-2 flex items-center justify-between absolute top-0">
      {/* Left - Logo & Hamburger */}
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-gray-600 hover:text-indigo-600 transition">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-1">
          <span className="text-indigo-600 font-extrabold text-2xl">idea</span>
          <span className="font-semibold text-lg text-gray-800">VAULT</span>
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[60%] rounded-full px-4 py-2 text-sm border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Right - Icons & User */}
      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 hover:text-indigo-600 transition">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
            3
          </span>
        </button>

        <button className="text-gray-600 hover:text-indigo-600 transition">
          <HelpCircle size={22} />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
          >
            <Image
              src="/user-avatar.png" // put avatar in public folder
              alt="User"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-medium text-gray-700">Juan</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl border border-gray-100 z-10">
              <ul className="text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  Settings
                </li>
                <li className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
