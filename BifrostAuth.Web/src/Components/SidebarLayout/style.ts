import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Shell = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
`;

export const Sidebar = styled.aside`
  background: #ffffff;
  color: #756eff;
  height: 100vh;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Brand = styled.h1`
  margin: 0;
  font-size: 22px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SidebarLink = styled(NavLink)`
  color: #696969;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: #756eff;
    background: rgb(245, 243, 243);
  }

  &.active {
    color: #ffffff;
    background: #756eff;
  }
`;

export const Content = styled.main`
  padding: 28px;
  overflow: auto;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

export const LogoutButton = styled.button`
  border: 0;
  background: #494949;
  color: #ffffff;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;

  &:hover {
    background: #313131;
    color: #8645ff;
  }
`;

export const OutletContainer = styled.section`
  margin-top: 20px;
`;

export const MobileHeader = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
`;

export const MobileMenuButton = styled.button`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px 12px;
  cursor: pointer;
`;

export const MobileNav = styled.nav<{ $open: boolean }>`
  display: none;

  @media (max-width: 900px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
`;

export const MobileLink = styled(NavLink)`
  color: #111827;
  text-decoration: none;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;

  &.active {
    background: #e0e7ff;
    border-color: #6366f1;
  }
`;

export const DesktopOnly = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: block;
  }
`;
