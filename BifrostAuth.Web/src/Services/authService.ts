const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

const URL_API = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

// ─── Token Storage ────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens(token: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function logout(): void {
    clearTokens();
    window.location.assign("/login");
}

// ─── Aliases mantidos para compatibilidade com código existente ───────────────

/** @deprecated Use getAccessToken() */
export function getAuthToken(): string | null {
    return getAccessToken();
}

/** @deprecated Use saveTokens() */
export function saveAuthToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

/** @deprecated Use clearTokens() */
export function clearAuthToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export type AuthResponse = {
    token: string;
    refreshToken: string;
};

let refreshingPromise: Promise<AuthResponse> | null = null;

export async function refreshToken(): Promise<AuthResponse> {
    if (refreshingPromise) {
        return refreshingPromise;
    }

    refreshingPromise = (async () => {
        try {
            const currentRefreshToken = getRefreshToken();
            if (!currentRefreshToken) {
                throw new Error("Sem refresh token disponível.");
            }

            const response = await fetch(`${URL_API}/api/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: currentRefreshToken })
            });

            if (!response.ok) {
                throw new Error("Falha ao renovar token.");
            }

            const data = (await response.json()) as AuthResponse;
            saveTokens(data.token, data.refreshToken);
            return data;
        } finally {
            refreshingPromise = null;
        }
    })();

    return refreshingPromise;
}

// ─── JWT Validation ───────────────────────────────────────────────────────────

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

function isAudienceValid(audience: string | string[] | undefined, expectedAudience: string): boolean {
    if (!expectedAudience) {
        return false;
    }

    if (typeof audience === "string") {
        return audience === expectedAudience;
    }

    if (Array.isArray(audience)) {
        return audience.includes(expectedAudience);
    }

    return false;
}

export async function isJwtValid(token: string): Promise<boolean> {
    const secret = import.meta.env.VITE_JWT_SECRET as string | undefined;
    const clientId = (import.meta.env.CLIENT_ID as string | undefined)?.trim();

    if (!secret || !clientId || !token) {
        return false;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }

    const payloadJson = decodeBase64Url(parts[1]);
    const payload = safeJsonParse<{ exp?: number; aud?: string | string[] }>(payloadJson);

    if (!payload || isTokenExpired(payload) || !isAudienceValid(payload.aud, clientId)) {
        return false;
    }

    return verifyJwtHs256Signature(token, secret);
}

export async function isStoredTokenValid(): Promise<boolean> {
    const token = getAccessToken();

    // Se o token existe e ainda é válido, tudo certo
    if (token) {
        const valid = await isJwtValid(token);
        if (valid) return true;
    }

    // Token ausente ou expirado — tenta renovar via refresh token
    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
        clearTokens();
        return false;
    }

    try {
        await refreshToken();
        return true;
    } catch {
        clearTokens();
        return false;
    }
}
