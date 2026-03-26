import styled, { keyframes } from "styled-components";
import type { AlertType } from "../../Types/Alert";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const toneByType: Record<AlertType, { bg: string; border: string; fg: string }> = {
    error: {
        bg: "#fee2e2",
        border: "#ef4444",
        fg: "#7f1d1d"
    },
    success: {
        bg: "#efe7ff",
        border: "#8b5cf6",
        fg: "#4c1d95"
    },
    warning: {
        bg: "#fef3c7",
        border: "#f59e0b",
        fg: "#78350f"
    }
};

export const AlertWrapper = styled.div<{ $type: AlertType }>`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1200;
  min-width: 280px;
  max-width: min(420px, calc(100vw - 32px));
  border-radius: 12px;
  border: 1px solid ${({ $type }) => toneByType[$type].border};
  background: ${({ $type }) => toneByType[$type].bg};
  color: ${({ $type }) => toneByType[$type].fg};
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  padding: 12px 40px 12px 14px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  animation: ${slideIn} 0.2s ease-out;

  @media (max-width: 720px) {
    right: 12px;
    bottom: 12px;
    left: 12px;
    max-width: calc(100vw - 24px);
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 8px;
  top: 6px;
  border: 0;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
`;
