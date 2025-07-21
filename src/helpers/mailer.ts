import nodemailer from "nodemailer";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2b3cc8c18a4b99",
        pass: "794519940b32c8",
      },
    });
    const mailOptions = {
      from: "pplcallmeomj@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your Email",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "Verify your email" : "Reset your Email"
      }</p>`,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Mail sent successfully ✅");
    return mailResponse;
  } catch (error: any) {
    console.error("MAIL ERROR 💥", error);
    throw new Error(error.message);
  }
};
