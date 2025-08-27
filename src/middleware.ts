// middleware.ts or middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: "/api/:path*", // Apply only to API routes
};

export default function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Define allowed origins for your specific setup
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [
          "https://hire-chat-front.vercel.app", // Your production frontend
          // Add other production origins if you have them, e.g., your admin panel
        ]
      : [
          "http://localhost:3000", // Common Next.js dev server
          "http://localhost:5173", // Common Vite dev server
          // Add other development origins if you have them
        ];

  // Check if the request origin is one of the allowed origins
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // If the origin is not allowed and it's not a same-origin request (origin is null/undefined for same-origin)
  // or if origin is present but not in allowedOrigins, we should probably block it.
  // However, for basic CORS, we'll proceed and let the browser block if headers aren't set.
  // The important part is to *not* set Access-Control-Allow-Origin if it's not allowed,
  // or set it to a specific allowed origin.

  // Handle preflight requests (OPTIONS method)
  if (request.method === "OPTIONS") {
    const preflightHeaders: HeadersInit = {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept", // Add common headers
      "Access-Control-Max-Age": "86400", // Cache preflight response for 24 hours
    };

    if (isAllowedOrigin) {
      preflightHeaders["Access-Control-Allow-Origin"] = origin!; // Use ! to assert origin is not null
      preflightHeaders["Access-Control-Allow-Credentials"] = "true"; // Only if you need to send cookies/auth headers
    } else {
      // If the origin is not allowed, you can choose to explicitly deny it
      // or simply not set Access-Control-Allow-Origin, letting the browser block.
      // For this scenario, we'll only set it if allowed.
      // Alternatively, you could return a 403 Forbidden here for unallowed origins.
      // return new Response("Forbidden", { status: 403 });
    }

    return new Response(null, { status: 204, headers: preflightHeaders }); // 204 No Content is standard for successful preflight
  }

  // Handle actual requests (e.g., POST, GET)
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin!);
    response.headers.set("Access-Control-Allow-Credentials", "true"); // Match preflight
  }

  // Ensure all necessary headers for actual requests are set if the preflight passed
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );

  return response;
}
