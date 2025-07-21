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
  const [countDown, setCountDown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    otp: "",
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
    let timer: ReturnType<typeof setTimeout>;
    if (isResendDisabled && countDown > 0) {
      timer = setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    } else if (countDown === 0) {
      setIsResendDisabled(false);
    }
  }, [countDown, isResendDisabled]);

  const resendOtp = async () => {
    try {
      if (!user.email) {
        toast.error("Please provide your email to resend OTP.");
        return;
      }
      const response = await axios.post("api/users/resendotp", {
        email: user.email,
      });
      console.log("otp sent", response.data);
      setIsResendDisabled(true);
      setCountDown(20);
    } catch (error: any) {
      console.log("Failed to send otp", error.message);
    }
  };
  useEffect(() => {
    if (user.email.length > 1 && user.password.length > 1 && user.otp.length)
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
      <label htmlFor="otp">otp</label>
      <input
        className="ring-1 outline-none"
        type="text"
        placeholder="otp"
        id="otp"
        value={user.otp}
        onChange={(e) => setUser({ ...user, otp: e.target.value })}
      />
      <button
        onClick={resendOtp}
        disabled={isResendDisabled}
        className="text-sm text-blue-600 hover:underline mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isResendDisabled ? `Resend in ${countDown}s` : "Resend Otp"}
      </button>
      <button className="bg-sky-400" onClick={onLogin}>
        {buttonDisabled ? "no-login" : "login"}
      </button>
      <Link href="/signup">Visit Signup</Link>
    </div>
  );
}
