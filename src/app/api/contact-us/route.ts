import { NextResponse } from "next/server";
import { sendEmail } from "../../../lib/mail"; // Adjust path if needed

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    // 1. Extract the form data from the request
    const data: ContactFormData = await request.json();
    const { name, email, message } = data;

    // 2. Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 3. Construct the email subject and body on the server
    const subject = `New Contact Form Message from ${name}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #0056b3; text-align: center;">New Message from Website Chat</h1>
        <p>You have received a new message from the floating chat widget.</p>
        
        <h2 style="border-bottom: 2px solid #0056b3; padding-bottom: 5px; color: #0056b3;">Sender's Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
          </tr>
        </table>
        
        <h2 style="border-bottom: 2px solid #0056b3; padding-bottom: 5px; margin-top: 20px; color: #0056b3;">Message</h2>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 5px solid #0056b3;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">This is an automated notification.</p>
      </div>
    `;

    // 4. Send the email using your utility
    await sendEmail({
      to: process.env.RECIPIENT_EMAIL!,
      subject: subject,
      html: htmlBody,
    });

    // 5. Return a success response
    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact Us API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
