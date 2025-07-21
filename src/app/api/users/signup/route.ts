import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log(reqBody);

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // check if user already exists
    const Extuser = await User.findOne({ email });
    if (Extuser)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    console.log(Extuser);

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);

    //create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    //save the user into the db
    const savedUser = await user.save();
    console.log(savedUser);

    //send Verification email

    await sendMail({ email, emailType: "VERIFY", userId: savedUser._id });
    console.log("EMAIL SENT");
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
