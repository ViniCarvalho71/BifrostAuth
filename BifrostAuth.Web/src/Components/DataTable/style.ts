import styled from "styled-components";

export const TableToolbar = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  width: min(360px, 100%);
  height: 38px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;

  &:focus {
    border-color: #756eff;
    outline: 0;
    box-shadow: 0 0 0 3px rgba(117, 110, 255, 0.15);
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px; 
`;

export const PaginationSection = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 10px;
  }
`;

export const PaginationButtonsCenter = styled.div`
  grid-column: 2;

  @media (max-width: 900px) {
    grid-column: 1;
  }
`;

export const PaginationMetaRight = styled.div`
  grid-column: 3;
  justify-self: end;

  @media (max-width: 900px) {
    grid-column: 1;
    justify-self: center;
  }
`;

export const PaginationInfo = styled.span`
  color: #4b5563;
  font-size: 13px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const PaginationSelect = styled.select`
  height: 34px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0 8px;
  background: #ffffff;
  color: #374151;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
`;

export const PaginationButton = styled.button`
  height: 34px;
  border-radius: 8px;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TableContainer = styled.div`
  margin-top: 10px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const TableHead = styled.thead`
  background: #f9fafb;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: 0;
  }
  
  &:hover {
    background: #f3f4f6;
  }
`;

export const Th = styled.th<{ $align?: "left" | "center" | "right"; $width?: string }>`
  padding: 12px 14px;
  text-align: ${({ $align }) => $align ?? "left"};
  width: ${({ $width }) => $width ?? "auto"};
  color: #6c6080;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

export const Td = styled.td<{ $align?: "left" | "center" | "right" }>`
  padding: 12px 14px;
  text-align: ${({ $align }) => $align ?? "left"};
  font-size: 15px;
  color: #374151;
  white-space: nowrap;
`;

export const EmptyState = styled.td`
  padding: 20px 14px;
  color: #6b7280;
  text-align: center;
`;
