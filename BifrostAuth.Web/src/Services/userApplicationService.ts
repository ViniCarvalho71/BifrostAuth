import type { UserApplication, UserApplicationCreateRequest } from "../Types/UserApplication";
import { fetchWithAuth } from "./fetchWithAuth";

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

export async function getUserApplications() {
    const resultado = await fetchWithAuth(`${URL_API}/api/UserApplication`, {
        method: "GET"
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as UserApplication[],
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const data = resultado.status === 204 ? [] : await resultado.json();

    return {
        status: resultado.status,
        data: data as UserApplication[]
    };
}

export async function getUserApplicationOData(query?: string) {
    const queryString = query ? `?${query}` : "";
    const resultado = await fetchWithAuth(`${URL_API}/api/UserApplication/getOData${queryString}`, {
        method: "GET"
    });

    if (resultado.status < 200 || resultado.status >= 300) {
        return {
            status: resultado.status,
            data: [] as UserApplication[],
            errorMessage: await readErrorMessage(resultado)
        };
    }

    const rawData = await resultado.json();
    const data = (rawData as ODataResponse<UserApplication>).value ?? (rawData as UserApplication[]);

    return {
        status: resultado.status,
        data
    };
}

export async function getUserApplicationsByUserId(userId: string) {
    if (!isGuid(userId)) {
        return {
            status: 400,
            data: [] as UserApplication[],
            errorMessage: "UserId invalido. Informe um GUID valido."
        };
    }

    return getUserApplicationOData(`$filter=userId eq ${toODataGuidLiteral(userId)}`);
}

export async function createUserApplication(payload: UserApplicationCreateRequest) {
    if (!isGuid(payload.userId) || !isGuid(payload.applicationId)) {
        return {
            status: 400,
            data: null,
            errorMessage: "UserId/ApplicationId invalidos. Informe GUIDs validos."
        };
    }

    const resultado = await fetchWithAuth(`${URL_API}/api/UserApplication`, {
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

    let data: UserApplication | null = null;
    if (resultado.status !== 204) {
        const rawBody = await resultado.text();
        if (rawBody) {
            data = JSON.parse(rawBody) as UserApplication;
        }
    }

    return {
        status: resultado.status,
        data
    };
}

export async function deleteUserApplication(id: string) {
    if (!isGuid(id)) {
        return {
            status: 400,
            errorMessage: "Id invalido. Informe um GUID valido."
        };
    }

    const resultado = await fetchWithAuth(`${URL_API}/api/UserApplication/${id}`, {
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
