import { getAccessToken, getRefreshToken, logout, refreshToken } from "./authService";



// ─── Construção das requisições ───────────────────────────────────────────────

function buildAuthHeaders(init?: RequestInit): RequestInit {
    const token = getAccessToken();
    const existingHeaders = new Headers(init?.headers);

    if (token) {
        existingHeaders.set("Authorization", `Bearer ${token}`);
    }

    if (!existingHeaders.has("Content-Type") && !(init?.body instanceof FormData)) {
        existingHeaders.set("Content-Type", "application/json");
    }

    return { ...init, headers: existingHeaders };
}

// ─── Fetch com interceptor ────────────────────────────────────────────────────

/**
 * Wrapper sobre o fetch nativo que:
 * - Injeta automaticamente o Authorization header.
 * - Em caso de 401, tenta renovar o access token via refresh token.
 * - Reexecuta a requisição original com o novo token.
 * - Garante apenas uma renovação simultânea (serializa requisições concorrentes).
 * - Em caso de falha no refresh, faz logout e redireciona para o login.
 */
export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Primeira tentativa com o token atual
    const firstResponse = await fetch(input, buildAuthHeaders(init));

    if (firstResponse.status !== 401) {
        return firstResponse;
    }

    // ─── Tratamento de 401 ────────────────────────────────────────────────────

    // Sem refresh token: logout imediato
    if (!getRefreshToken()) {
        logout();
        // Retorna a resposta original para não quebrar code paths (mas o redirect já foi acionado)
        return firstResponse;
    }

    try {
        await refreshToken();
    } catch {
        logout();
        return firstResponse;
    }

    // Se após a renovação ainda não há token (logout foi chamado), retorna 401 original
    if (!getAccessToken()) {
        return firstResponse;
    }

    // Segunda tentativa com o novo token
    return fetch(input, buildAuthHeaders(init));
}
