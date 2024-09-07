"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
const Appbar = () => {
  const session = useSession();
  return (
    <div className=" w-full flex justify-between absolute  items-center px-16 pt-6 text-white">
      <div
        className=" text-2xl font-bold tracking-tight cursor-pointer"
        onClick={() => window.location.replace("/")}
      >
        Sentilizer
      </div>
      <div className=" flex gap-x-5">
        {!session.data?.user ? (
          <></>
        ) : (
          !window.location.href.includes("/dashboard") && (
            <Button
              className=" "
              variant={"secondary"}
              onClick={() => window.location.replace("/dashboard")}
            >
              Dashboard
            </Button>
          )
        )}
        {!session.data?.user ? (
          <Button
            className=" bg-green-500 hover:bg-green-600"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Login
          </Button>
        ) : (
          <Button
            className=" bg-green-500 hover:bg-green-600"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Appbar;
