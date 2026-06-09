import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Orgofresh" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.EMAIL_USER,
    });

    console.log(" Email sent");
  } catch (error) {
    console.log("❌ Email error FULL:", error);
    throw error;
  }
};

export default sendEmail;