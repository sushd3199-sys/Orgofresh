
import sendEmail from "../utils/sendEmail.js";
import { contactAdminTemplate, contactUserTemplate } from "../utils/emailTemplates.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    //ADMIN EMAIL
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Message",
      html: contactAdminTemplate({ name, email, message }),
      replyTo: email,
    });

    //USER AUTO REPLY
    await sendEmail({
      to: email,
      subject: "We received your message",
      html: contactUserTemplate(name),
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};