import styled from "styled-components";

export const Page = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.h1`
  margin: 0;
  color: #756eff;
  font-size: 28px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #4b5563;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 2px solid #756eff;
  border-radius: 8px;
  padding: 10px 14px;
  background: #ffffff;
  color: #756eff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #756eff;
    color: #ffffff;
  }
`;

export const ActionsGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const ActionButton = styled.button<{ $variant?: "view" | "edit" | "danger" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid
    ${({ $variant }) => {
      if ($variant === "danger") return "#fecaca";
      if ($variant === "edit") return "#fde68a";
      if ($variant === "view") return "#bfdbfe";
      return "#d1d5db";
    }};
  background:
    ${({ $variant }) => {
      if ($variant === "danger") return "#fef2f2";
      if ($variant === "edit") return "#fffbeb";
      if ($variant === "view") return "#eff6ff";
      return "#ffffff";
    }};
  color:
    ${({ $variant }) => {
      if ($variant === "danger") return "#dc2626";
      if ($variant === "edit") return "#b45309";
      if ($variant === "view") return "#1d4ed8";
      return "#374151";
    }};
  cursor: pointer;

  &:hover {
    background:
      ${({ $variant }) => {
        if ($variant === "danger") return "#fee2e2";
        if ($variant === "edit") return "#fef3c7";
        if ($variant === "view") return "#dbeafe";
        return "#f3f4f6";
      }};
    border: none;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 1080px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.25);
`;

export const ModalBody = styled.div`
  max-height: 52vh;
  overflow: auto;
  padding-right: 4px;
`;

export const PermissionBindingHint = styled.p`
  margin: 0 0 10px;
  font-size: 13px;
  color: #4b5563;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const ModalTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 22px;
  color: #756eff;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 10px 0 6px;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
`;

export const SecondaryButton = styled.button`
  height: 38px;
  border-radius: 8px;
  padding: 0 14px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

export const PrimaryButton = styled.button`
  height: 38px;
  border-radius: 8px;
  padding: 0 14px;
  border: 0;
  background: #756eff;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #6659ff;
  }

  &:disabled {
    background: #b8b3ff;
    cursor: not-allowed;
  }
`;

export const ViewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ViewItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  background: #f9fafb;
`;

export const ViewLabel = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
`;

export const ViewValue = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  word-break: break-word;
`;
