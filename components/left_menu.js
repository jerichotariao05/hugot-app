"use client";

import { useUser } from "@/app/context/UserContext";
import {
  HomeIcon,
  ChatBubbleBottomCenterTextIcon,
  BookmarkIcon,
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const LeftMenu = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("HUID");
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      <div className="flex items-stretch w-1/5 h-[calc(100vh-96px)] fixed top-20">
        <Card className="w-full flex flex-col justify-between">
          <CardContent>
            <nav className="space-y-6 py-8">
              <a
                href="/user"
                className="flex items-center py-2 px-4 rounded hover:border-l-4 hover:border-l-sky-300 hover:bg-slate-100"
              >
                <HomeIcon className="w-8 h-8 mr-4" />
                Home
              </a>
              <a
                href="#"
                className="flex items-center py-2 px-4 hover:border-l-4 hover:border-l-sky-300 hover:bg-slate-100"
              >
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8 mr-4" />
                My Hugots
              </a>
              <a
                href="/user/bookmark"
                className="flex items-center py-2 px-4 hover:border-l-4 hover:border-l-sky-300 hover:bg-slate-100"
              >
                <BookmarkIcon className="w-8 h-8 mr-4" />
                Bookmarks
              </a>
              <a
                href="/user/profile"
                className="flex items-center py-2 px-4 hover:border-l-4 hover:border-l-sky-300 hover:bg-slate-100"
              >
                <UserIcon className="w-8 h-8 mr-4" />
                Profile
              </a>
              <a
                href="#"
                onClick={handleLogout}
                className="flex items-center py-2 px-4 hover:border-l-4 hover:border-l-sky-300 hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeftEndOnRectangleIcon className="w-8 h-8 mr-4" />
                Log out
              </a>
            </nav>
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={user?.avatar || "/assets/user_profile.png"}
                  alt={`${user?.username || "User"} ${user?.email || "Avatar"}`}
                  className="h-12 w-12 rounded-full"
                />
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium text-sm">
                  {user?.username || "User"}
                </p>
                <p className="text-sm text-gray-400">
                  {user?.email || "john@gmail.com"}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LeftMenu;
