function inviteSecret() {
  return (
    process.env.INVITE_SECRET ??
    process.env.SESSION_SECRET ??
    "atlas-dev-invite-secret"
  );
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
    new TextEncoder().encode(inviteSecret()),
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

export type InvitePayload = {
  courseId: string;
  email: string;
  exp: number;
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function encodeInviteToken(input: {
  courseId: string;
  email: string;
}) {
  const payload: InvitePayload = {
    courseId: input.courseId,
    email: input.email.toLowerCase(),
    exp: Date.now() + SEVEN_DAYS_MS,
  };
  const encoded = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function decodeInviteToken(
  token: string,
): Promise<InvitePayload | null> {
  const [encoded, signature] = token.split(".");

  if (!encoded || !signature) {
    return null;
  }

  const expected = await sign(encoded);
  if (!timingSafeEqual(signature, expected)) {
    return null;
  }

  try {
    const json = new TextDecoder().decode(fromBase64Url(encoded));
    const payload = JSON.parse(json) as InvitePayload;

    if (
      !payload?.courseId ||
      !payload?.email ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function buildJoinUrl(token: string, origin?: string) {
  const base =
    origin ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/join?token=${encodeURIComponent(token)}`;
}
