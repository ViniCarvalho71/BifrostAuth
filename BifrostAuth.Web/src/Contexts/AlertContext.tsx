import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Alert from "../Components/Alert";
import type { AlertPayload } from "../Types/Alert";

type AlertContextValue = {
    showAlert: (payload: AlertPayload) => void;
};

const DEFAULT_DURATION_MS = 4500;
const PENDING_ALERT_STORAGE_KEY = "pending-alert";

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [currentAlert, setCurrentAlert] = useState<AlertPayload | null>(null);

    const showAlert = useCallback((payload: AlertPayload) => {
        if (!payload.message.trim()) {
            return;
        }

        setCurrentAlert(payload);
    }, []);

    const closeAlert = useCallback(() => {
        setCurrentAlert(null);
    }, []);

    useEffect(() => {
        if (!currentAlert) {
            return;
        }

        const timeoutMs = currentAlert.durationMs ?? DEFAULT_DURATION_MS;
        const timer = window.setTimeout(() => {
            setCurrentAlert(null);
        }, timeoutMs);

        return () => {
            window.clearTimeout(timer);
        };
    }, [currentAlert]);

    useEffect(() => {
        const pendingRaw = sessionStorage.getItem(PENDING_ALERT_STORAGE_KEY);
        if (!pendingRaw) {
            return;
        }

        sessionStorage.removeItem(PENDING_ALERT_STORAGE_KEY);

        try {
            const pendingAlert = JSON.parse(pendingRaw) as AlertPayload;
            if (pendingAlert.message?.trim()) {
                setCurrentAlert(pendingAlert);
            }
        } catch {
            // Ignore invalid pending payload.
        }
    }, []);

    const value = useMemo<AlertContextValue>(() => ({ showAlert }), [showAlert]);

    return (
        <AlertContext.Provider value={value}>
            {children}
            {currentAlert && <Alert alert={currentAlert} onClose={closeAlert} />}
        </AlertContext.Provider>
    );
}

export function useAlert(): AlertContextValue {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }

    return context;
}

export function queueAlertForNextPage(payload: AlertPayload): void {
    if (!payload.message.trim()) {
        return;
    }

    sessionStorage.setItem(PENDING_ALERT_STORAGE_KEY, JSON.stringify(payload));
}
