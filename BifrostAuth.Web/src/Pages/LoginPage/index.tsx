import { useEffect, useState } from "react";
import Input from "../../Components/Input";
import { Button, Link, LoginBox, PageContainer, Title } from "./style";
import { Login } from "../../Services/loginService";
import { getApplicationByClientId } from "../../Services/applicationService";
import type { LoginRequest } from "../../Types/Login";
import type { Application } from "../../Types/Application";
import { useAlert } from "../../Contexts/AlertContext";

type ComparableUrl = {
    origin: string;
    path: string;
};

function normalizeUrlForComparison(value: string): ComparableUrl | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null;
        }

        const pathname = parsed.pathname !== "/" ? parsed.pathname.replace(/\/+$/, "") : "/";
        return {
            origin: parsed.origin,
            path: pathname
        };
    } catch {
        return null;
    }
}

function isRedirectUriAllowed(registered: ComparableUrl, requested: ComparableUrl): boolean {
    if (registered.origin !== requested.origin) {
        return false;
    }

    if (registered.path === "/") {
        return true;
    }

    if (requested.path === registered.path) {
        return true;
    }

    return requested.path.startsWith(`${registered.path}/`);
}

function LoginPage() {
    const [applicationName, setApplicationName] = useState("Acessando...");
    const [application, setApplication] = useState<Application | null>(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const clientId = searchParams.get("client_id");

        if (!clientId) {
            return;
        }

        const getOData = async () => {
            const resultado = await getApplicationByClientId(clientId);
            if (resultado.status !== 200 || !resultado.data) {
                return;
            }

            setApplication(resultado.data);

            if (resultado.data.name) {
                setApplicationName(resultado.data.name);
            }
        };

        getOData();
    }, []);

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const searchParams = new URLSearchParams(window.location.search);
        const clientId = searchParams.get("client_id") ?? "";
        const redirectUrl = searchParams.get("redirect_uri");
        const form = event.currentTarget;
        const formData = new FormData(form);

        const loginPayload : LoginRequest = {
            email: formData.get("email") as string,
            password: formData.get("senha") as string,
            clientid: clientId
        };

        if (!loginPayload.email.trim() || !loginPayload.password.trim()) {
            showAlert({
                type: "warning",
                message: "Preencha e-mail e senha para continuar."
            });
            return;
        }

        if (!loginPayload.email.includes("@")) {
            showAlert({
                type: "warning",
                message: "Informe um e-mail valido."
            });
            return;
        }

        if (!loginPayload.clientid.trim()) {
            showAlert({
                type: "warning",
                message: "Client ID nao informado na URL."
            });
            return;
        }

        if (redirectUrl) {
            const expectedApplication = application ?? (await getApplicationByClientId(loginPayload.clientid)).data;

            if (!expectedApplication) {
                showAlert({
                    type: "error",
                    message: "Aplicacao nao encontrada para o Client ID informado."
                });
                return;
            }

            const expectedRedirect = normalizeUrlForComparison(expectedApplication.redirectUrl);
            const requestedRedirect = normalizeUrlForComparison(redirectUrl);
            if (!expectedRedirect || !requestedRedirect || !isRedirectUriAllowed(expectedRedirect, requestedRedirect)) {
                showAlert({
                    type: "error",
                    message: "Redirect URI invalido para esta aplicacao."
                });
                return;
            }
        }
        
        const resultado = await Login(loginPayload);

        if(resultado.status === 200){
            if (resultado.token) {
                const callbackBase = redirectUrl ?? window.location.origin;
                const callbackUrl = new URL("/callback", callbackBase);
                callbackUrl.searchParams.set("token", resultado.token);
                if (resultado.refreshToken) {
                    callbackUrl.searchParams.set("refreshToken", resultado.refreshToken);
                }
                window.location.assign(callbackUrl.toString());
                return;
            }

            showAlert({
                type: "error",
                message: "Falha no login. Token nao retornado."
            });
            
        } else {
            showAlert({
                type: "error",
                message: resultado.errorMessage ?? "Falha no login. Verifique suas credenciais."
            });
        }
    }
    return <PageContainer>
        <Title>Bifrost Auth</Title>
        <LoginBox action="post" onSubmit={(e) => submitForm(e)} noValidate>
                <h1>{applicationName}</h1>
                <Input placeholder="seuemail@exemplo.com" type="email" name="email" width="300px" height="40px" />
                <Input placeholder="****** " type="password" name="senha" width="300px" height="40px" />
                <Link>Esqueci minha senha</Link>
                <Button type="submit">Entrar</Button>
        </LoginBox>
    </PageContainer>;
}

export default LoginPage;