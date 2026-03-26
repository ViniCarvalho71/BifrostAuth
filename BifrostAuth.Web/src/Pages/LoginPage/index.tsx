import { useEffect, useState } from "react";
import Input from "../../Components/Input";
import { Button, Link, LoginBox, PageContainer, Title } from "./style";
import { Login } from "../../Services/loginService";
import { saveAuthToken } from "../../Services/authService";
import { getApplicationByClientId } from "../../Services/applicationService";
import type { LoginRequest } from "../../Types/Login";
import { queueAlertForNextPage, useAlert } from "../../Contexts/AlertContext";

function LoginPage() {
    const [applicationName, setApplicationName] = useState("Acessando...");
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

            if (resultado.data.name) {
                setApplicationName(resultado.data.name);
            }
        };

        getOData();
    }, []);

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const searchParams = new URLSearchParams(window.location.search);
        const form = event.currentTarget;
        const formData = new FormData(form);

        const loginPayload : LoginRequest = {
            email: formData.get("email") as string,
            password: formData.get("senha") as string,
            clientid: searchParams.get("client_id") ?? ""
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

        const redirectUrl = searchParams.get("redirect_url");
        
        const resultado = await Login(loginPayload);

        if(resultado.status === 200){
            if (resultado.token) {
                saveAuthToken(resultado.token);
                queueAlertForNextPage({
                    type: "success",
                    message: "Login realizado com sucesso."
                });
                if (redirectUrl) {
                    window.location.assign(redirectUrl);
                    return;
                }

                window.location.assign("/usuarios");
            }
            
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