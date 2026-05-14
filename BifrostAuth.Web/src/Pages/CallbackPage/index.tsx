import { useEffect, useState } from "react";
import { clearAuthToken, isStoredTokenValid, saveAuthToken } from "../../Services/authService";
import { queueAlertForNextPage } from "../../Contexts/AlertContext";
import { LoginBox, PageContainer, Title } from "../LoginPage/style";

function CallbackPage() {
    const [statusMessage, setStatusMessage] = useState("Processando autenticacao...");

    useEffect(() => {
        const run = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const token = (searchParams.get("token") ?? "").trim();

            if (!token) {
                queueAlertForNextPage({
                    type: "error",
                    message: "Token nao informado."
                });
                window.location.assign("/login");
                return;
            }

            saveAuthToken(token);

            const valid = await isStoredTokenValid();
            if (!valid) {
                clearAuthToken();
                queueAlertForNextPage({
                    type: "error",
                    message: "Token invalido ou expirado."
                });
                window.location.assign("/login");
                return;
            }

            queueAlertForNextPage({
                type: "success",
                message: "Login realizado com sucesso."
            });
            window.location.assign("/painel");
        };

        setStatusMessage("Validando token...");
        void run();
    }, []);

    return (
        <PageContainer>
            <Title>Bifrost Auth</Title>
            <LoginBox as="div">
                <h1>Callback</h1>
                <p>{statusMessage}</p>
            </LoginBox>
        </PageContainer>
    );
}

export default CallbackPage;
