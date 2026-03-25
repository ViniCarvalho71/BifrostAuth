import styled from "styled-components";

export const TableContainer = styled.div`
  margin-top: 20px;
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
