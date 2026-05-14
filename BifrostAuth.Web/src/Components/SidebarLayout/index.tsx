import { useState } from "react";
import { Outlet } from "react-router-dom";
import { clearAuthToken } from "../../Services/authService";
import { returnToAuthorize } from "../../Utils/returnToAuthorize";
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

function SidebarLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    clearAuthToken();
    returnToAuthorize();
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
            <SidebarLink to="/usuarios">Usuários</SidebarLink>
            <SidebarLink to="/aplicacoes">Aplicações</SidebarLink>
            <SidebarLink to="/permissoes">Permissões</SidebarLink>
            <SidebarLink to="/cargos">Cargos</SidebarLink>
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
              Usuários
            </MobileLink>
            <MobileLink to="/aplicacoes" onClick={closeMobileMenu}>
              Aplicacoes
            </MobileLink>
            <MobileLink to="/permissoes" onClick={closeMobileMenu}>
              Permissões
            </MobileLink>
            <MobileLink to="/cargos" onClick={closeMobileMenu}>
              Cargos
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
