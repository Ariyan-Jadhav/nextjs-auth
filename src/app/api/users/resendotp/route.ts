import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { email } = reqBody;
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json(
      { error: "email doesn't exists" },
      { status: 404 }
    );
  await sendMail({ email, emailType: "VERIFY", userId: user._id });
  console.log("EMAIL SENT");
  return NextResponse.json({
    message: "User created successfully",
    success: true,
    user,
  });
}
