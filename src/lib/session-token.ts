export const SESSION_COOKIE = "atlas_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "DOCTOR";
};

function sessionSecret() {
  return process.env.SESSION_SECRET ?? "atlas-dev-session-secret";
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(signature);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function encodeSession(user: SessionUser) {
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify(user)));
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function decodeSession(token: string): Promise<SessionUser | null> {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = await sign(payload);

  if (!timingSafeEqual(signature, expected)) {
    return null;
  }

  try {
    const json = new TextDecoder().decode(fromBase64Url(payload));
    const user = JSON.parse(json) as SessionUser;

    if (!user?.id || !user?.email || !user?.name || user.role !== "DOCTOR") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}
