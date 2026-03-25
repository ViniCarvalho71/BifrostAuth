const TOKEN_STORAGE_KEY = "token";

function toBase64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(input: string): string {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (base64.length % 4)) % 4;
    const padded = base64 + "=".repeat(padLength);

    return atob(padded);
}

function safeJsonParse<T>(value: string): T | null {
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

async function verifyJwtHs256Signature(token: string, secret: string): Promise<boolean> {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }

    const [headerPart, payloadPart, signaturePart] = parts;
    const signingInput = `${headerPart}.${payloadPart}`;

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        new TextEncoder().encode(signingInput)
    );

    const expectedSignature = toBase64Url(new Uint8Array(signature));
    return expectedSignature === signaturePart;
}

function isTokenExpired(payload: { exp?: number }): boolean {
    if (typeof payload.exp !== "number") {
        return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
}

export function getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function saveAuthToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function isJwtValid(token: string): Promise<boolean> {
    const secret = import.meta.env.VITE_JWT_SECRET as string | undefined;

    if (!secret || !token) {
        return false;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }

    const payloadJson = decodeBase64Url(parts[1]);
    const payload = safeJsonParse<{ exp?: number }>(payloadJson);

    if (!payload || isTokenExpired(payload)) {
        return false;
    }

    return verifyJwtHs256Signature(token, secret);
}

export async function isStoredTokenValid(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) {
        return false;
    }

    const valid = await isJwtValid(token);
    if (!valid) {
        clearAuthToken();
    }

    return valid;
}
