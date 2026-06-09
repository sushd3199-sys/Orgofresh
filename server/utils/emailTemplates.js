const emailHeader = () => `
  <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:28px 32px;text-align:center;border-radius:12px 12px 0 0;">
    <div style="font-size:32px;margin-bottom:6px;">🥬</div>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;font-family:Arial,sans-serif;letter-spacing:-0.3px;">
      Orgofresh
    </h1>
    <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:12px;font-family:Arial,sans-serif;letter-spacing:0.1em;text-transform:uppercase;">
      Fresh · Organic · Fast
    </p>
  </div>
`;

const emailFooter = () => `
  <div style="background:#F8FAFC;padding:20px 32px;text-align:center;border-top:1px solid #E2E8F0;border-radius:0 0 12px 12px;">
    <div style="margin-bottom:12px;">
      <a href="${process.env.FRONTEND_URL}" style="color:#64748B;text-decoration:none;font-size:13px;margin:0 10px;font-family:Arial,sans-serif;">Home</a>
      <span style="color:#CBD5E1;">·</span>
      <a href="${process.env.FRONTEND_URL}/products" style="color:#64748B;text-decoration:none;font-size:13px;margin:0 10px;font-family:Arial,sans-serif;">Products</a>
      <span style="color:#CBD5E1;">·</span>
      <a href="${process.env.FRONTEND_URL}/contact" style="color:#64748B;text-decoration:none;font-size:13px;margin:0 10px;font-family:Arial,sans-serif;">Contact</a>
      <span style="color:#CBD5E1;">·</span>
      <a href="${process.env.FRONTEND_URL}/my-orders" style="color:#64748B;text-decoration:none;font-size:13px;margin:0 10px;font-family:Arial,sans-serif;">My Orders</a>
    </div>
    <p style="color:#94A3B8;font-size:12px;margin:0 0 4px;font-family:Arial,sans-serif;">
      📧 support@orgofresh.com &nbsp;|&nbsp; 📞 +91 9101903549
    </p>
    <p style="color:#CBD5E1;font-size:11px;margin:6px 0 0;font-family:Arial,sans-serif;">
      © ${new Date().getFullYear()} Orgofresh Pvt Ltd · Tezpur, Assam, India · All Rights Reserved
    </p>
  </div>
`;

const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    ${emailHeader()}
    ${content}
    ${emailFooter()}
  </div>
</body>
</html>
`;

const primaryButton = (text, url) => `
  <a href="${url}"
    style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#16a34a,#22c55e);
    color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;
    font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(22,163,74,0.35);margin-top:4px;">
    ${text}
  </a>
`;

export const welcomeEmailTemplate = (name) => emailWrapper(`
  <div style="padding:32px 32px 24px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;">🎉</div>
    <h2 style="color:#0F172A;font-size:22px;font-weight:800;margin:0 0 8px;font-family:Arial,sans-serif;">
      Welcome, ${name}!
    </h2>
    <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 24px;font-family:Arial,sans-serif;">
      Your Orgofresh account is ready. We bring you naturally grown,
      chemical-free groceries sourced directly from local farmers.
    </p>

    ${primaryButton("Start Shopping →", `${process.env.FRONTEND_URL}/products`)}
  </div>

  <!-- Feature highlights -->
  <div style="padding:0 32px 28px;">
    <div style="background:#F8FAFC;border-radius:12px;padding:20px;border:1px solid #F1F5F9;">
      <p style="color:#0F172A;font-weight:700;font-size:14px;margin:0 0 14px;font-family:Arial,sans-serif;">
        ✨ What you can explore:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">🥦 Organic Vegetables</td>
          <td width="50%" style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">🍎 Fresh Fruits</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">🥛 Plant-Based Milk</td>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">🍞 Bakery & Breads</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">🍜 Instant Foods</td>
          <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#374151;">🌾 Grains & Cereals</td>
        </tr>
      </table>
    </div>

    <!-- Delivery promise -->
    <div style="display:flex;gap:12px;margin-top:16px;">
      <div style="flex:1;background:#F0FDF4;border-radius:10px;padding:14px;text-align:center;border:1px solid #BBF7D0;">
        <div style="font-size:22px;">🚀</div>
        <p style="color:#16a34a;font-weight:700;font-size:12px;margin:4px 0 0;font-family:Arial,sans-serif;">30-Min Delivery</p>
      </div>
      <div style="flex:1;background:#FEF9C3;border-radius:10px;padding:14px;text-align:center;border:1px solid #FDE68A;">
        <div style="font-size:22px;">🌿</div>
        <p style="color:#A16207;font-weight:700;font-size:12px;margin:4px 0 0;font-family:Arial,sans-serif;">100% Organic</p>
      </div>
      <div style="flex:1;background:#EDE9FE;border-radius:10px;padding:14px;text-align:center;border:1px solid #DDD6FE;">
        <div style="font-size:22px;">💰</div>
        <p style="color:#7C3AED;font-weight:700;font-size:12px;margin:4px 0 0;font-family:Arial,sans-serif;">Best Prices</p>
      </div>
    </div>
  </div>
`);

export const otpEmailTemplate = (otp, type = "verify") => emailWrapper(`
  <div style="padding:32px;text-align:center;">
    <div style="font-size:44px;margin-bottom:12px;">
      ${type === "verify" ? "📧" : "🔐"}
    </div>
    <h2 style="color:#0F172A;font-size:20px;font-weight:800;margin:0 0 8px;font-family:Arial,sans-serif;">
      ${type === "verify" ? "Verify Your Email" : "Reset Your Password"}
    </h2>
    <p style="color:#64748B;font-size:14px;margin:0 0 28px;font-family:Arial,sans-serif;line-height:1.6;">
      ${type === "verify"
        ? "Use the OTP below to verify your Orgofresh account."
        : "Use the OTP below to reset your password."}
    </p>

    <!-- OTP Box -->
    <div style="background:#F8FAFC;border:2px dashed #16a34a;border-radius:14px;padding:24px 32px;margin:0 auto 24px;display:inline-block;">
      <p style="color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;font-family:Arial,sans-serif;">
        Your OTP
      </p>
      <p style="color:#0F172A;font-size:36px;font-weight:800;letter-spacing:10px;margin:0;font-family:monospace;">
        ${otp}
      </p>
    </div>

    <p style="color:#EF4444;font-size:13px;font-weight:600;margin:0 0 20px;font-family:Arial,sans-serif;">
      ⏱ This OTP expires in <strong>5 minutes</strong>
    </p>

    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:14px;text-align:left;">
      <p style="color:#92400E;font-size:12px;margin:0;font-family:Arial,sans-serif;line-height:1.6;">
        🔒 <strong>Security tip:</strong> Never share this OTP with anyone.
        Orgofresh will never ask for your OTP via phone or chat.
      </p>
    </div>
  </div>
`);

export const contactAdminTemplate = ({ name, email, message }) => emailWrapper(`
  <div style="padding:28px 32px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="font-size:28px;">📩</div>
      <div>
        <h2 style="color:#0F172A;font-size:18px;font-weight:800;margin:0;font-family:Arial,sans-serif;">New Contact Message</h2>
        <p style="color:#94A3B8;font-size:12px;margin:2px 0 0;font-family:Arial,sans-serif;">Received from Orgofresh website</p>
      </div>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="padding:10px 14px;background:#F8FAFC;border-radius:8px 8px 0 0;border:1px solid #F1F5F9;border-bottom:none;">
          <p style="color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 2px;font-family:Arial,sans-serif;">From</p>
          <p style="color:#0F172A;font-size:14px;font-weight:600;margin:0;font-family:Arial,sans-serif;">${name}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;background:#F8FAFC;border:1px solid #F1F5F9;border-top:none;border-bottom:none;">
          <p style="color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 2px;font-family:Arial,sans-serif;">Email</p>
          <a href="mailto:${email}" style="color:#16a34a;font-size:14px;font-weight:600;text-decoration:none;font-family:Arial,sans-serif;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;background:#F8FAFC;border-radius:0 0 8px 8px;border:1px solid #F1F5F9;border-top:none;">
          <p style="color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;font-family:Arial,sans-serif;">Message</p>
          <p style="color:#374151;font-size:14px;line-height:1.7;margin:0;font-family:Arial,sans-serif;white-space:pre-wrap;">${message}</p>
        </td>
      </tr>
    </table>

    <a href="mailto:${email}?subject=Re: Your message to Orgofresh"
      style="display:inline-block;padding:11px 22px;background:#0F172A;color:#fff;text-decoration:none;border-radius:9px;font-weight:700;font-size:13px;font-family:Arial,sans-serif;">
      Reply to ${name} →
    </a>
  </div>
`);

export const contactUserTemplate = (name) => emailWrapper(`
  <div style="padding:32px;text-align:center;">
    <div style="font-size:44px;margin-bottom:12px;">🙌</div>
    <h2 style="color:#0F172A;font-size:20px;font-weight:800;margin:0 0 10px;font-family:Arial,sans-serif;">
      Thanks, ${name}!
    </h2>
    <p style="color:#64748B;font-size:14px;line-height:1.7;margin:0 0 24px;font-family:Arial,sans-serif;">
      We've received your message and will get back to you within
      <strong style="color:#0F172A;">24 hours</strong> during business days.
    </p>

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:18px;margin-bottom:24px;text-align:left;">
      <p style="color:#16a34a;font-weight:700;font-size:13px;margin:0 0 6px;font-family:Arial,sans-serif;">📞 Need urgent help?</p>
      <p style="color:#374151;font-size:13px;margin:0;font-family:Arial,sans-serif;">
        Call us at <strong>+91 9101903549</strong> or email
        <strong>support@orgofresh.com</strong>
      </p>
    </div>

    ${primaryButton("Browse Products →", `${process.env.FRONTEND_URL}/products`)}
  </div>
`);

export const subscribeAdminTemplate = (email) => emailWrapper(`
  <div style="padding:28px 32px;text-align:center;">
    <div style="font-size:40px;margin-bottom:12px;">📢</div>
    <h2 style="color:#0F172A;font-size:18px;font-weight:800;margin:0 0 8px;font-family:Arial,sans-serif;">
      New Newsletter Subscriber
    </h2>
    <p style="color:#64748B;font-size:13px;margin:0 0 20px;font-family:Arial,sans-serif;">
      Someone just subscribed to Orgofresh deals!
    </p>
    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px;display:inline-block;">
      <p style="color:#94A3B8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;font-family:Arial,sans-serif;">Email</p>
      <p style="color:#16a34a;font-size:16px;font-weight:800;margin:0;font-family:Arial,sans-serif;">${email}</p>
    </div>
  </div>
`);

export const subscribeUserTemplate = () => emailWrapper(`
  <div style="padding:32px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;">🎉</div>
    <h2 style="color:#0F172A;font-size:20px;font-weight:800;margin:0 0 10px;font-family:Arial,sans-serif;">
      You're Subscribed!
    </h2>
    <p style="color:#64748B;font-size:14px;line-height:1.7;margin:0 0 24px;font-family:Arial,sans-serif;">
      Welcome to the Orgofresh family! 🥬<br>
      You'll be the first to know about exclusive deals, new arrivals,
      and seasonal offers.
    </p>

    <div style="background:#FEF9C3;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <p style="color:#A16207;font-size:13px;font-weight:600;margin:0;font-family:Arial,sans-serif;">
        🎁 <strong>Welcome Gift:</strong> Use code <strong style="color:#0F172A;font-size:15px;letter-spacing:1px;">FRESH10</strong> for 10% OFF your first order!
      </p>
    </div>

    ${primaryButton("Shop Now →", `${process.env.FRONTEND_URL}/products`)}

    <p style="color:#CBD5E1;font-size:11px;margin:20px 0 0;font-family:Arial,sans-serif;">
      You can unsubscribe anytime by contacting support@orgofresh.com
    </p>
  </div>
`);
