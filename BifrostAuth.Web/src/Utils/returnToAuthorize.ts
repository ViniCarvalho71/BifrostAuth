function readEnv(name: "CLIENT_ID" | "REDIRECT_URI"): string {
    return ((import.meta.env[name] as string | undefined) ?? "").trim();
}

function buildAuthorizeUrl(): string {
    const clientId = readEnv("CLIENT_ID");
    const redirectUri = readEnv("REDIRECT_URI") || `${window.location.origin}/callback`;

    const authorizeUrl = new URL("/authorize", window.location.origin);
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);

    return authorizeUrl.toString();
}

export function returnToAuthorize(): void {
    window.location.assign(buildAuthorizeUrl());
}

export function getAuthorizeUrl(): string {
    return buildAuthorizeUrl();
}
