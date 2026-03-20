import Input from "../../Components/Input";
import { Button, Link, LoginBox, PageContainer, Title } from "./style";

function LoginPage() {
    return <PageContainer>
        <LoginBox>
            <Title>AuthSTI</Title>
            <Input placeholder="seuemail@exemplo.com" type="email" width="300px" height="40px" />
            <Input placeholder="****** " type="password" width="300px" height="40px" />
            <Link>Esqueci minha senha</Link>
            <Button>Entrar</Button>
        </LoginBox>
    </PageContainer>;
}

export default LoginPage;