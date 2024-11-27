"use client";

import { useState } from "react";
import {
  HomeIcon,
  ChatBubbleBottomCenterTextIcon,
  BookmarkIcon,
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon, 
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("HUID");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="md:hidden">
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <XMarkIcon className="h-10 w-10" />
        ) : (
          <Bars3Icon className="h-10 w-10" />
        )}
      </div>
      {isOpen && (
        <div className="absolute left-0 top-16 right-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-20">
          <nav className="space-y-6 py-8">
              <a
                href="/user"
                className="flex items-center py-2 px-4 rounded hover:bg-slate-100"
              >
                <HomeIcon className="w-8 h-8 mr-4" />
                Home
              </a>
              <a
                href="#"
                className="flex items-center py-2 px-4 hover:bg-slate-100"
              >
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8 mr-4" />
                My Hugots
              </a>
              <a
                href="/user/bookmark"
                className="flex items-center py-2 px-4 hover:bg-slate-100"
              >
                <BookmarkIcon className="w-8 h-8 mr-4" />
                Bookmarks
              </a>
              <a
                href="/user/profile"
                className="flex items-center py-2 px-4 hover:bg-slate-100"
              >
                <UserIcon className="w-8 h-8 mr-4" />
                Profile
              </a>
              <a
                href="#"
                onClick={handleLogout}
                className="flex items-center py-2 px-4 hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeftEndOnRectangleIcon className="w-8 h-8 mr-4" />
                Log out
              </a>
            </nav>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
