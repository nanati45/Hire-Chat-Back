// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Define the allowed origin. Prioritize the environment variable for production,
  // but fall back to the local Vite dev server URL for local development.
  const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

  // --- Handle Preflight OPTIONS Requests ---
  // The browser sends an OPTIONS request first to check for CORS permissions.
  if (request.method === "OPTIONS") {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS"); // Specify methods
    headers.set("Access-Control-Allow-Headers", "Content-Type"); // Specify allowed headers
    headers.set("Access-Control-Max-Age", "86400"); // Cache preflight response for 24 hours

    // Respond with 204 No Content for preflight requests.
    return new NextResponse(null, { status: 204, headers });
  }

  // --- Handle Actual API Requests ---
  // For all other requests (like POST), pass them through to the API route.
  // We'll add the CORS header to the response from the actual API route.
  const response = NextResponse.next();

  // Add the CORS header to the response.
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);

  return response;
}

// This config specifies that the middleware should run on all API routes.
export const config = {
  matcher: "/api/:path*",
};
