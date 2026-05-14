import { SITE_AUTH_COOKIE, siteAuthToken } from "@/lib/site-auth";

export async function POST(request: Request) {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    return Response.json({ error: "Site password not configured" }, { status: 500 });
  }

  const { password } = await request.json().catch(() => ({}));
  if (typeof password !== "string" || password !== expected) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await siteAuthToken(expected);
  const response = Response.json({ success: true });
  response.headers.append(
    "Set-Cookie",
    [
      `${SITE_AUTH_COOKIE}=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${60 * 60 * 24 * 30}`,
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  );
  return response;
}
