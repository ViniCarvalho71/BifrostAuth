import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1100;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.25);
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #111827;
`;

export const Message = styled.p`
  margin: 10px 0 0;
  font-size: 14px;
  color: #4b5563;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const CancelButton = styled.button`
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

export const ConfirmButton = styled.button`
  height: 38px;
  border-radius: 8px;
  padding: 0 14px;
  border: 0;
  background: #dc2626;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }

  &:disabled {
    background: #fca5a5;
    cursor: not-allowed;
  }
`;
