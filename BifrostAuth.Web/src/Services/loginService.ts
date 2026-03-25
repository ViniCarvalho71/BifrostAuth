import type { LoginRequest } from "../Types/Login";

const URL_API = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

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
    let token = resultado.status === 200 ? (await resultado.json()).token : null;

    return {
        status: resultado.status,
        token: token
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