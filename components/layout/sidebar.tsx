import Image from "next/image";
import React from "react";
import { navLinks } from "./navLinks";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { Disc } from "lucide-react";

const Sidebar = ({ currentPath = "/dashboard" }: { currentPath: string }) => {
  return (
    <aside className="fixed top-0 left-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-10 ">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative w-10  h-10  ">
            <Image src={"/inventory.png"} alt="nventory-logo" fill />
          </div>
          <span>Inventory System</span>
        </div>
      </div>

      <nav className="space-y-2">
        <div className="text-xs md:text-sm font-semibold text-gray-400 uppercase">
          Inventory
        </div>

        {navLinks.map((nav, i) => {
          const IconComp = nav.icon;
          const isActive = currentPath === nav.href;
          return (
            <Link
              key={i}
              href={nav.href}
              className={`flex items-center space-x-3 py-2 px-3 cursor-pointer rounded-lg  transition-all duration-200 ease-linear  font-semibold " ${
                isActive
                  ? "bg-purple-100 text-gray-800 font-semibold "
                  : " hover:bg-gray-600 text-gray-300"
              }`}>
              <IconComp className="w54 h-5" />
              <span className="text-sm"> {nav.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div>
          <UserButton showUserInfo  />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
