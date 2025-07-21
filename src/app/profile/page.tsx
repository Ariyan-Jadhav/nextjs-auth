"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("HEYYYYY See this :", response.data);

      toast.success("Logout success");
      router.push("/login");
    } catch (error: any) {
      console.log("logout Failed", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#748DAE] sm:h-screen">
      <div className="flex flex-col justify-center items-center">
        <img className="h-[170px]" src="/11.png" alt="" />
        <h1 className="text-4xl font-mono font-bold">HALL OF SHAME</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 ">
        <img
          className="h-[250px] w-[80%] border-5 object-cover object-top"
          src="/hof_1.jpg"
        />
        <img
          className="h-[250px] w-[80%] border-5 object-cover object-center"
          src="/hof_2.jpg"
        />
        <img
          className="h-[250px] w-[80%] border-5 object-cover object-center"
          src="/hof_3.jpg"
        />
        <img
          className="h-[250px] w-[80%] border-5 object-cover object-center"
          src="/hof_4.jpg"
        />
      </div>
      <div className="bg-[#FFBC4C] w-full mt-4 h-[50px] sm:h-full flex justify-around items-center">
        <button
          onClick={logout}
          className="bg-[rgb(212,232,228)] hover:bg-[rgb(212,232,228,0.8)] focus:bg-[rgb(212,232,228,0.8)] text-black font-bold px-2 py-1 rounded-3xl"
        >
          Logout
        </button>
        <Link href={"/changepass"}>
          <button className="bg-[rgb(212,232,228)] hover:bg-[rgb(212,232,228,0.8)] focus:bg-[rgb(212,232,228,0.8)] text-black font-bold px-2 py-1 rounded-3xl">
            Change Password
          </button>
        </Link>
      </div>
    </div>
  );
}
