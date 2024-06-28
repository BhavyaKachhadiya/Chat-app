'use client'
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const { data: session } = useSession();
  return (
    <div>
        <button href={"/login"} onClick={()=> {signIn("google")}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
      
      Google
      {session?.user?.name}
  </button>
    </div>
  )
}

export default page