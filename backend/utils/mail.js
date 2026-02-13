import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/*
ENV REQUIRED (Render + .env):
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=16digitapppassword
*/

// 🔥 Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= OTP MAIL =================
export const sendOtpMail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Vingo Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code - Vingo",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Vingo OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#ff4d2d;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <p>If you did not request this, please ignore.</p>
        </div>
      `,
    });

    console.log("✅ OTP MAIL SENT:", info.response);
  } catch (error) {
    console.error("❌ OTP MAIL ERROR:", error.message);
  }
};

// ================= DELIVERY OTP MAIL =================
export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Vingo Delivery" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Delivery OTP - Vingo",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Delivery Verification</h2>
          <p>Your delivery OTP is:</p>
          <h1 style="color:#ff4d2d;">${otp}</h1>
          <p>Please share this OTP with the delivery partner.</p>
        </div>
      `,
    });

    console.log("✅ DELIVERY OTP MAIL SENT:", info.response);
  } catch (error) {
    console.error("❌ DELIVERY OTP MAIL ERROR:", error.message);
  }
};
