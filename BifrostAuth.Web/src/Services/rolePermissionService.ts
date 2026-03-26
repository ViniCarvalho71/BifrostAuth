import type { RolePermission, RolePermissionCreateRequest } from "../Types/RolePermission";

const URL_API = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

type ODataResponse<T> = {
    value?: T[];
};

type ErrorBody = {
    message?: string;
    error?: string;
    title?: string;
    detail?: string;
};

const GUID_REGEX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

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

function isGuid(value: string): boolean {
    return GUID_REGEX.test(value.trim());
}

function toODataGuidLiteral(value: string): string {
    return value.trim().toLowerCase();
}

export async function getRolePermissions() {
    const resultado = await fetch(`${URL_API}/api/RolePermissions`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as RolePermission[],
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const data = resultado.status === 204 ? [] : await resultado.json();

    return {
        status: resultado.status,
        data: data as RolePermission[]
    };
}

export async function getRolePermissionOData(query?: string) {
    const queryString = query ? `?${query}` : "";
    const resultado = await fetch(`${URL_API}/api/RolePermissions/getOData${queryString}`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as RolePermission[],
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const rawData = await resultado.json();
    const data = (rawData as ODataResponse<RolePermission>).value ?? (rawData as RolePermission[]);

    return {
        status: resultado.status,
        data
    };
}

export async function getRolePermissionsByRoleId(roleId: string) {
    if (!isGuid(roleId)) {
        return {
            status: 400,
            data: [] as RolePermission[],
            errorMessage: "RoleId invalido. Informe um GUID valido."
        };
    }

    return getRolePermissionOData(`$filter=roleId eq ${toODataGuidLiteral(roleId)}`);
}

export async function createRolePermission(payload: RolePermissionCreateRequest) {
    if (!isGuid(payload.roleId) || !isGuid(payload.permissionId)) {
        return {
            status: 400,
            data: null,
            errorMessage: "RoleId/PermissionId invalidos. Informe GUIDs validos."
        };
    }

    const resultado = await fetch(`${URL_API}/api/RolePermissions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: null,
            errorMessage: await readErrorMessage(resultado)
        };
    }

    let data: RolePermission | null = null;
    if (resultado.status !== 204) {
        const rawBody = await resultado.text();
        if (rawBody) {
            data = JSON.parse(rawBody) as RolePermission;
        }
    }

    return {
        status: resultado.status,
        data
    };
}

export async function deleteRolePermission(id: string) {
    if (!isGuid(id)) {
        return {
            status: 400,
            errorMessage: "Id invalido. Informe um GUID valido."
        };
    }

    const resultado = await fetch(`${URL_API}/api/RolePermissions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
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
