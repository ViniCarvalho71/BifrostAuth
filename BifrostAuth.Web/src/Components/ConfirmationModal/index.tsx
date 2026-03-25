import {
  Actions,
  CancelButton,
  Card,
  ConfirmButton,
  Message,
  Overlay,
  Title
} from "./style";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isSubmitting = false,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={() => !isSubmitting && onCancel()}>
      <Card onClick={(event) => event.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>

        <Actions>
          <CancelButton type="button" onClick={onCancel} disabled={isSubmitting}>
            {cancelText}
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Excluindo..." : confirmText}
          </ConfirmButton>
        </Actions>
      </Card>
    </Overlay>
  );
}

export default ConfirmationModal;
