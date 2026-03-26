import styled from "styled-components";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Content = styled.div`
  min-width: 0;
`;
