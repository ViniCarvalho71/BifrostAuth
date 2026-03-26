import type { Role, RoleCreateRequest } from "../Types/Role";

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

export async function getRoles() {
    const resultado = await fetch(`${URL_API}/api/Roles`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as Role[],
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const data = resultado.status === 204 ? [] : await resultado.json();

    return {
        status: resultado.status,
        data: data as Role[]
    };
}

export async function getRolesOData(query?: string) {
    const queryString = query ? `?${query}` : "";
    const resultado = await fetch(`${URL_API}/api/Roles/getOData${queryString}`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as Role[],
            totalCount: 0,
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const rawData = await resultado.json();
    const typed = rawData as ODataResponse<Role>;
    const data = typed.value ?? (rawData as Role[]);

    return {
        status: resultado.status,
        data,
        totalCount: typed["@odata.count"] ?? data.length
    };
}

export async function getRoleById(id: string) {
    const resultado = await fetch(`${URL_API}/api/Roles/${id}`, {
        method: "GET",
        headers: getAuthHeaders()
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
        data: data as Role | null
    };
}

export async function createRole(payload: RoleCreateRequest) {
    const resultado = await fetch(`${URL_API}/api/Roles`, {
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

    let data: Role | null = null;
    if (resultado.status !== 204) {
        const rawBody = await resultado.text();
        if (rawBody) {
            data = JSON.parse(rawBody) as Role;
        }
    }

    return {
        status: resultado.status,
        data
    };
}

export async function updateRole(payload: Role) {
    const resultado = await fetch(`${URL_API}/api/Roles/${payload.id}`, {
        method: "PUT",
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

    let data: Role | null = null;
    if (resultado.status !== 204) {
        const rawBody = await resultado.text();
        if (rawBody) {
            data = JSON.parse(rawBody) as Role;
        }
    }

    return {
        status: resultado.status,
        data
    };
}

export async function deleteRole(id: string) {
    const resultado = await fetch(`${URL_API}/api/Roles/${id}`, {
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
