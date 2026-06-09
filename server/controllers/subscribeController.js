
import sendEmail from "../utils/sendEmail.js";
import { subscribeAdminTemplate, subscribeUserTemplate } from "../utils/emailTemplates.js";

export const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    // ADMIN EMAIL
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Subscriber",
      html: subscribeAdminTemplate(email),
    });

    // USER EMAIL
    await sendEmail({
      to: email,
      subject: "🎉 Welcome to Orgofresh Deals",
      html: subscribeUserTemplate(),
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};
