import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { oldPass, newPass } = reqBody;
    const userId = await getDataFromToken(request);
    const user = await User.findById({ _id: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(oldPass, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "password invalid" }, { status: 404 });
    }
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPass, salt);
    user.password = newHashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password changed" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.data);
  }
}
