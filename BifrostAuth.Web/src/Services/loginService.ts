import type { LoginRequest } from "../Types/Login";

const URL_API = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

type ErrorBody = {
    message?: string;
    error?: string;
    title?: string;
    detail?: string;
};

async function readErrorMessage(resultado: Response): Promise<string | null> {
    const rawBody = await resultado.text();
    if (!rawBody) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawBody) as ErrorBody;
        return parsed.message ?? parsed.error ?? parsed.title ?? parsed.detail ?? rawBody;
    } catch {
        return rawBody;
    }
}

export async function Login(loginRequest: LoginRequest) {
    const resultado = await fetch(`${URL_API}/api/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: loginRequest.email,
            password: loginRequest.password,
            clientid: loginRequest.clientid
        })
    });

    if (resultado.status !== 200) {
        return {
            status: resultado.status,
            token: null,
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const body = await resultado.json() as { token?: string | null; refreshToken?: string | null };

    return {
        status: resultado.status,
        token: body.token ?? null,
        refreshToken: body.refreshToken ?? null
    }
}

export async function todosOsClientes(){
    const resultado = await fetch(`${URL_API}/api/cliente`, {
        method: "GET"
    });

    var dados = await resultado.json();
    return {
        status: resultado.status,
        data: dados
    }
}