import nodemailer from "nodemailer";

// Interface for our email options
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// 1. Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, Mailgun etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Create the function to send the email
export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  const mailOptions = {
    from: `"Hire Chat" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html, // Use the 'html' property for styled emails
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email." };
  }
};
