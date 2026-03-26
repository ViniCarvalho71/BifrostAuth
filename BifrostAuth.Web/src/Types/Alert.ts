export type AlertType = "error" | "success" | "warning";

export type AlertPayload = {
    type: AlertType;
    message: string;
    durationMs?: number;
};
