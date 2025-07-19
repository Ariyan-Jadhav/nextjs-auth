"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);

      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error: any) {
      console.log("login Failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 1 && user.password.length > 1)
      setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-1">
      <h1 className="bg-zinc-200 text-4xl text-center">
        {loading ? "proccessing" : "Login"}
      </h1>
      <hr />
      <label htmlFor="email">email</label>
      <input
        className="ring-1 outline-none"
        type="text"
        placeholder="email"
        id="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <label htmlFor="password">password</label>
      <input
        className="ring-1 outline-none"
        type="text"
        placeholder="password"
        id="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button className="bg-sky-400" onClick={onLogin}>
        {buttonDisabled ? "no-login" : "login"}
      </button>
      <Link href="/signup">Visit Signup</Link>
    </div>
  );
}
