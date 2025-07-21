"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [data, setData] = useState("nothing hehe!");
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

  const getUserDetails = async () => {
    const response = await axios.get("/api/users/me");
    console.log(response.data);
    setData(response.data.data._id);
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Profile Page</h1>
      <h2>
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <button onClick={logout} className="bg-black text-amber-50 px-2 py-1">
        Logout
      </button>
      <Link href={"/changepass"}>
        <button>Change Password</button>
      </Link>
      <button
        onClick={getUserDetails}
        className="bg-black text-amber-50 px-2 py-1"
      >
        getDetails
      </button>
    </div>
  );
}
