'use client'

import Link from "next/link";
import MobileMenu from "./mobile_menu";
import styles from "../css/text.module.css";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/app/context/UserContext";

const Navbar = () => {

  const { user } = useUser();

  return (
    <>
  <div className="flex items-center justify-between h-16 px-6 py-2 bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-md">
        {/*Left side*/}
        <div>
          <Link href="#" className={`text-3xl font-bold whitespace-nowrap ${styles.lobsterFont}`}>
            Hugot Connect
          </Link>
        </div>

        {/*Center*/}
        <div className="hidden md:flex w-[50%]"></div>
        {/*Right side */}
        <div className="w-[30%] flex items-center gap-4 xl:gap-4 justify-end">
          {/*Right side */}
          <div className="md:flex gap-4 items-center hidden">
            <Avatar>
              <AvatarImage
                src={user?.avatar || '/assets/user_profile.png'}
                alt={`${user?.first_name || 'User'} ${user?.last_name || 'Avatar'}`}
                className="rounded-full"
              />
            </Avatar>
          </div>
          <MobileMenu />
        </div>
      </div>
    </>
  );
};

export default Navbar;
