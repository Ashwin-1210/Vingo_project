import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });

  console.log("MAIL SENT:", info.response); // ⭐ important
};

// export const sendOtpMail = async (email, otp) => {
//   console.log("=================================");
//   console.log("📩 OTP GENERATED FOR:", email);
//   console.log("🔑 OTP:", otp);
//   console.log("=================================");
// };

// export const sendDeliveryOtpMail = async (user, otp) => {
//   const info = await transporter.sendMail({
//     from: process.env.EMAIL,
//     to: user.email,
//     subject: "Delivery OTP",
//     html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
//   });

//   console.log("DELIVERY MAIL SENT:", info.response);
// };
export const sendDeliveryOtpMail = async (user, otp) => {
  console.log("=================================");
  console.log("🚚 DELIVERY OTP FOR:", user?.email);
  console.log("🔑 OTP:", otp);
  console.log("=================================");
};
