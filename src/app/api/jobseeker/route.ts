import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail"; // Import our shared utility

// Define a type for the expected form data
type JobSeekerFormData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  targetRole: string;
  experience: string;
  employmentType: string;
  readyToInterview?: boolean;
  skills?: string;
};

export async function POST(request: Request) {
  try {
    const data: JobSeekerFormData = await request.json();

    const subject = `New Job Seeker Lead: ${data.fullName || "N/A"}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #2a9d8f; text-align: center;">New Job Seeker Profile</h1>
        <p>A new candidate has joined the talent network. Details are below:</p>
        
        <h2 style="border-bottom: 2px solid #2a9d8f; padding-bottom: 5px; color: #2a9d8f;">Candidate Profile</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Full Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.fullName
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${
            data.email
          }">${data.email}</a></td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.phone
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Location:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.location
          }</td></tr>
        </table>
        
        <h2 style="border-bottom: 2px solid #2a9d8f; padding-bottom: 5px; margin-top: 20px; color: #2a9d8f;">Career Preferences & Status</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Industry Interest:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.industry
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Target Role:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.targetRole
          }</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Experience Level:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.experience
          }</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Employment:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.employmentType
          }</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ready to Interview:</td><td style="padding: 8px; border: 1px solid #ddd;">${
            data.readyToInterview !== false ? "Yes" : "No"
          }</td></tr>
        </table>

        <h2 style="border-bottom: 2px solid #2a9d8f; padding-bottom: 5px; margin-top: 20px; color: #2a9d8f;">Key Skills & Certifications</h2>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 5px solid #2a9d8f;">
          <p style="white-space: pre-wrap; margin: 0;">${
            data.skills || "Not specified"
          }</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">This is an automated notification.</p>
      </div>
    `;

    await sendEmail({
      to: process.env.RECIPIENT_EMAIL!,
      subject: subject,
      html: htmlBody,
    });

    // Send confirmation email to the job seeker
    const confirmationSubject =
      "Congratulations! Your Application Has Been Received";
    const confirmationHtmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Congratulations, ${data.fullName}!</h2>
        <p>Your submission has been sent. We will be in touch with you within the next 2 business days.</p>
        <br>
        <p>Best regards,</p>
        <p>The Hireside Chat Team</p>
      </div>
    `;

    await sendEmail({
      to: data.email, // Send to the job seeker's email address
      subject: confirmationSubject,
      html: confirmationHtmlBody,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
