import { NextResponse } from "next/server";
import { sendEmail } from "../../../lib/mail"; // Make sure this path is correct

export async function POST(request: Request) {
  try {
    // 1. Extract the email from the incoming request body
    const { email } = await request.json();

    // 2. Basic validation: Ensure email is provided
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    // 3. Construct the email subject and body on the server
    const subject = `New Newsletter Subscription`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #1a73e8; text-align: center;">New Newsletter Subscription</h1>
        <p style="font-size: 16px;">A new user has subscribed to your newsletter.</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center;">
          <p style="margin: 0; font-size: 18px; font-weight: bold;">
            ${email}
          </p>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
          This is an automated notification from your application.
        </p>
      </div>
    `;

    // 4. Send the email using your existing utility
    await sendEmail({
      to: process.env.RECIPIENT_EMAIL!, // Sends to the admin email in your .env.local
      subject: subject,
      html: htmlBody,
    });

    // 5. Return a success response to the frontend
    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
