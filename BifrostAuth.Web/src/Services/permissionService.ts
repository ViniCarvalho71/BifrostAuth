import type { Permission, PermissionCreateRequest } from "../Types/Permission";
import { fetchWithAuth } from "./fetchWithAuth";

const URL_API = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

type ODataResponse<T> = {
    value?: T[];
    "@odata.count"?: number;
};

type ErrorBody = {
    message?: string;
    error?: string;
    title?: string;
    detail?: string;
};

async function readErrorMessage(resultado: Response): Promise<string | null> {
    const rawBody = await resultado.text();
    if (!rawBody) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawBody) as ErrorBody;
        return parsed.message ?? parsed.error ?? parsed.title ?? parsed.detail ?? rawBody;
    } catch {
        return rawBody;
    }
}

export async function getPermissions() {
    const resultado = await fetchWithAuth(`${URL_API}/api/Permissions`, {
        method: "GET"
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as Permission[],
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const data = resultado.status === 204 ? [] : await resultado.json();

    return {
        status: resultado.status,
        data: data as Permission[]
    };
}

export async function getPermissionsOData(query?: string) {
    const queryString = query ? `?${query}` : "";
    const resultado = await fetchWithAuth(`${URL_API}/api/Permissions/getOData${queryString}`, {
        method: "GET"
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as Permission[],
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const rawData = await resultado.json();
    const typed = rawData as ODataResponse<Permission>;
    const data = typed.value ?? (rawData as Permission[]);

    return {
        status: resultado.status,
        data,
        totalCount: typed["@odata.count"] ?? data.length
    };
}

export async function getPermissionById(id: string) {
    const resultado = await fetchWithAuth(`${URL_API}/api/Permissions/${id}`, {
        method: "GET"
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: null,
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const data = resultado.status === 204 ? null : await resultado.json();

    return {
        status: resultado.status,
        data: data as Permission | null
    };
}

export async function createPermission(payload: PermissionCreateRequest) {
    const resultado = await fetchWithAuth(`${URL_API}/api/Permissions`, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: null,
            errorMessage: await readErrorMessage(resultado)
        };
    }

    let data: Permission | null = null;
    if (resultado.status !== 204) {
        const rawBody = await resultado.text();
        if (rawBody) {
            data = JSON.parse(rawBody) as Permission;
        }
    }

    return {
        status: resultado.status,
        data
    };
}

export async function updatePermission(payload: Permission) {
    const resultado = await fetchWithAuth(`${URL_API}/api/Permissions/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: null,
            errorMessage: await readErrorMessage(resultado)
        };
    }

    let data: Permission | null = null;
    if (resultado.status !== 204) {
        const rawBody = await resultado.text();
        if (rawBody) {
            data = JSON.parse(rawBody) as Permission;
        }
    }

    return {
        status: resultado.status,
        data
    };
}

export async function deletePermission(id: string) {
    const resultado = await fetchWithAuth(`${URL_API}/api/Permissions/${id}`, {
        method: "DELETE"
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            errorMessage: await readErrorMessage(resultado)
        };
    }

    return {
        status: resultado.status
    };
}
