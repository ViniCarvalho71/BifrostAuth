import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isStoredTokenValid } from "../../Services/authService";
import type { ProtectedRouteProps } from "../../Types/Route";



function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;

        const validate = async () => {
            const valid = await isStoredTokenValid();
            if (isMounted) {
                setIsValid(valid);
            }
        };

        validate();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isValid === null) {
        return null;
    }

    if (!isValid) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
