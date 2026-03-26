import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../../Services/authService";
import {
  Brand,
  Content,
  DesktopOnly,
  LogoutButton,
  MobileHeader,
  MobileLink,
  MobileMenuButton,
  MobileNav,
  MobileOnly,
  Nav,
  OutletContainer,
  Shell,
  Sidebar,
  SidebarLink,
  TopBar
} from "./style";

const CLIENT_ID = (import.meta.env.CLIENT_ID as string | undefined)?.trim() ?? "";
const AUTHORIZE_REDIRECT = `/authorize?client_id=${encodeURIComponent(CLIENT_ID)}`;

function SidebarLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    clearAuthToken();
    navigate(AUTHORIZE_REDIRECT, { replace: true });
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Shell>
      <DesktopOnly>
        <Sidebar>
          <Brand>Bifrost Auth</Brand>
          <Nav>
            <SidebarLink to="/painel" end>
              Inicio
            </SidebarLink>
            <SidebarLink to="/usuarios">Usuarios</SidebarLink>
            <SidebarLink to="/aplicacoes">Aplicacoes</SidebarLink>
          </Nav>
          <TopBar>
            <LogoutButton type="button" onClick={logout}>
              Sair
            </LogoutButton>
          </TopBar>
        </Sidebar>
      </DesktopOnly>

      <Content>
        <MobileOnly>
          <MobileHeader>
            <Brand>Bifrost Auth</Brand>
            <MobileMenuButton
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              Menu
            </MobileMenuButton>
          </MobileHeader>
          <MobileNav $open={mobileMenuOpen}>
            <MobileLink to="/painel" end onClick={closeMobileMenu}>
              Inicio
            </MobileLink>
            <MobileLink to="/usuarios" onClick={closeMobileMenu}>
              Usuarios
            </MobileLink>
            <MobileLink to="/aplicacoes" onClick={closeMobileMenu}>
              Aplicacoes
            </MobileLink>
            <LogoutButton type="button" onClick={logout}>
              Sair
            </LogoutButton>
          </MobileNav>
        </MobileOnly>

        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </Content>
    </Shell>
  );
}

export default SidebarLayout;
