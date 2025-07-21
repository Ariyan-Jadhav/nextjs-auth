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
    <div>
      <input
        type="text"
        placeholder="current password"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
      />
      <input
        type="text"
        placeholder="new password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      <button onClick={changePass}>Change Password</button>
    </div>
  );
}

export default page;
