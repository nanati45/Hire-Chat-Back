import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail"; // Import our shared utility

// Define a type for the expected form data for better type safety
type EmployerFormData = {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  positionTitle: string;
  positions: number;
  urgency: string;
  requirements?: string;
  format?: string;
  preferredDay?: string;
  preferredTime?: string;
};

export async function POST(request: Request) {
  try {
    // 1. Get the form data from the request body
    const data: EmployerFormData = await request.json();

    // 2. Define the Subject Line
    const subject = `New Employer Lead: ${data.companyName || "N/A"}`;

    // 3. Construct the HTML Email Body (same HTML as before)
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #0056b3; text-align: center;">New Employer Lead Submission</h1>
        <p>A new employer has submitted their hiring needs. Details are below:</p>
        
        <h2 style="border-bottom: 2px solid #0056b3; padding-bottom: 5px; color: #0056b3;">Company & Hiring Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.companyName
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Contact Person:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.contactName
          }</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${
            data.email
          }">${data.email}</a></td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.phone || "Not provided"
          }</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Industry:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.industry
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Position Title:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.positionTitle
          }</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Number of Positions:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.positions
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Urgency:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.urgency
          }</td></tr>
        </table>
        
        <h2 style="border-bottom: 2px solid #0056b3; padding-bottom: 5px; margin-top: 20px; color: #0056b3;">Event Preferences</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Format:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.format || "Not specified"
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Day:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.preferredDay || "Not specified"
          }</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Time:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.preferredTime || "Not specified"
          }</td></tr>
        </table>
        
        <h2 style="border-bottom: 2px solid #0056b3; padding-bottom: 5px; margin-top: 20px; color: #0056b3;">Key Requirements</h2>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 5px solid #0056b3;">
          <p style="white-space: pre-wrap; margin: 0;">${
            data.requirements || "Not specified"
          }</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">This is an automated notification.</p>
      </div>
    `;

    // 4. Send the email using the utility
    await sendEmail({
      to: process.env.RECIPIENT_EMAIL!,
      subject: subject,
      html: htmlBody,
    });

    // 5. Return a success response
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    // 6. Return an error response
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
