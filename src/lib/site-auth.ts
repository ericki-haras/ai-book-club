export const SITE_AUTH_COOKIE = "site-auth";

export async function siteAuthToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`site-auth:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
