import type { AlertPayload } from "../../Types/Alert";
import { AlertWrapper, CloseButton } from "./style";

type AlertProps = {
    alert: AlertPayload;
    onClose: () => void;
};

function Alert({ alert, onClose }: AlertProps) {
    return (
        <AlertWrapper role="alert" aria-live="assertive" $type={alert.type}>
            {alert.message}
            <CloseButton type="button" aria-label="Fechar alerta" onClick={onClose}>
                ×
            </CloseButton>
        </AlertWrapper>
    );
}

export default Alert;
