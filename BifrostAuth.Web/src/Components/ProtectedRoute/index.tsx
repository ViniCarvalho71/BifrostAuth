import { useEffect, useState } from "react";
import { isStoredTokenValid } from "../../Services/authService";
import type { ProtectedRouteProps } from "../../Types/Route";
import { returnToAuthorize } from "../../Utils/returnToAuthorize";


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

    useEffect(() => {
        if (isValid === false) {
            returnToAuthorize();
        }
    }, [isValid]);

    if (isValid === null) {
        return null;
    }

    if (!isValid) {
        return null;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
