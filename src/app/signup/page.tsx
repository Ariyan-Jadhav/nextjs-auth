"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("api/users/signup", user);
      console.log("Signup Success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup Failed", error.message);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    )
      setButtonDisabled(false);
    else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-1">
      <h1 className="bg-zinc-200 text-4xl text-center">
        {loading ? "processing" : "Signup"}
      </h1>
      <hr />
      <label htmlFor="username">username</label>
      <input
        className="ring-1 outline-none"
        type="text"
        placeholder="username"
        id="username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
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
      <button
        className="mt-3 bg-sky-400 px-2 py-1 rounded-4xl"
        onClick={onSignup}
      >
        {buttonDisabled ? "No-Signup" : "SignUp"}
      </button>
      <Link href="/login">Visit Login</Link>
    </div>
  );
}
