import styled from "styled-components";

export const TabButton = styled.button<{ $active: boolean }>`
  width: 100%;
  border: 1px solid ${({ $active }) => ($active ? "#756eff" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#756eff" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};
  border-radius: 10px;
  text-align: left;
  padding: 11px 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: #756eff;
    color: ${({ $active }) => ($active ? "#ffffff" : "#756eff")};
    background: ${({ $active }) => ($active ? "#756eff" : "#f5f3ff")};
  }
`;
