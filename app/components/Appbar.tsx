"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
const Appbar = () => {
  const session = useSession();
  return (
    <div className=" absolute z-10 w-full flex justify-between mt-2  items-center max-sm:px-2 sm:px-16 sm:pt-6 text-white">
      <span
        className={` text-4xl font-bold tracking-tight  max-sm:text-2xl cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 `}
        onClick={() => window.location.replace("/")}
      >
        Sentilizer
      </span>
      <div className=" flex gap-x-5">
        {!session.data?.user ? (
          <></>
        ) : (
          !window.location.href.includes("/dashboard") && (
            <Button
              className="  max-sm:mt-1 bg-neutral-100 text-black hover:bg-neutral-300"
              onClick={() => window.location.replace("/dashboard")}
            >
              Dashboard
            </Button>
          )
        )}
        {!session.data?.user ? (
          <Button
            className=" max-sm:hidden "
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Login
          </Button>
        ) : (
          <>
            {window.location.href.includes("/dashboard") && (
              <Button className=" bg-neutral-800" onClick={() => signOut()}>
                Logout
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Appbar;
