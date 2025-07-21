import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { email, password, otp } = reqBody;

    if (!email || !password || !otp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "user do not exists" },
        { status: 404 }
      );

    if (!user.verifyOtp) {
      return NextResponse.json(
        { error: "OTP not found or already used. Please request a new one." },
        { status: 400 }
      );
    }
    console.log("verifyOtp does not exits");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "password invalid" }, { status: 404 });
    }
    const isValidOtp = await bcrypt.compare(otp, user.verifyOtp);
    if (!isValidOtp) {
      return NextResponse.json({ error: "OTP invalid" }, { status: 401 });
    }
    console.log("Otp and pass verification done");

    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;
    user.isVerified = true;
    await user.save();
    //create token data
    const tokenData = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login success",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
