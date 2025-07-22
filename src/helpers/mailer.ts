import nodemailer from "nodemailer";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    console.log(otp, hashedOtp);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyOtp: hashedOtp || "",
        verifyOtpExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedOtp,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ariyanthegreatest@gmail.com",
        pass: process.env.TRANSPOST_PASS, // not your actual Gmail password!
      },
    });
    const mailOptions = {
      from: "ariyanthegreatest@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your Email",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Mail sent successfully ✅");
    return mailResponse;
  } catch (error: any) {
    console.error("MAIL ERROR 💥", error);
    throw new Error(error.message);
  }
};

// `<p>Click <a href="${
//         process.env.DOMAIN
//       }/verifyemail?token=${otp}">here</a> to ${
//         emailType === "VERIFY" ? "Verify your email" : "Reset your Email"
//       }</p>`,
