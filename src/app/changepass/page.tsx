"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function page() {
  const rounter = useRouter();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const changePass = async () => {
    try {
      if (oldPass === "" || newPass === "") return;
      const res = await axios.post("/api/users/changepass", {
        oldPass,
        newPass,
      });
      console.log("pass changed", res.data);
      rounter.push("/profile");
    } catch (error: any) {
      console.log("Failed to change password", error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#113F67]">
      <input
        className="bg-[#FAF7F3] px-2 py-2 mb-2 rounded-2xl font-bold"
        type="text"
        placeholder="current password"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
      />
      <input
        className="bg-[#FAF7F3] px-2 py-2 mb-2 rounded-2xl font-bold"
        type="text"
        placeholder="new password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      <button
        className="bg-[rgb(217,162,153)]  hover:bg-[rgb(217,162,153,0.7)] focus:bg-[rgb(217,162,153,0.7)] p-2 rounded-2xl mt-3"
        onClick={changePass}
      >
        Change Password
      </button>
    </div>
  );
}

export default page;
