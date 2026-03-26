import type { Application, ApplicationCreateRequest } from "../Types/Application.ts";

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

export async function getApplications() {
	const resultado = await fetch(`${URL_API}/api/applications`, {
		method: "GET",
		headers: getAuthHeaders()
	});

	if (resultado.status < 200 || resultado.status >= 300) {
		return {
			status: resultado.status,
			data: [] as Application[],
			errorMessage: await readErrorMessage(resultado)
		};
	}

	const data = resultado.status === 204 ? [] : await resultado.json();

	return {
		status: resultado.status,
		data: data as Application[]
	};
}

export async function getOData(query?: string) {
	const queryString = query ? `?${query}` : "";
	const resultado = await fetch(`${URL_API}/api/applications/getOData${queryString}`, {
		method: "GET",
		headers: getAuthHeaders()
	});

	if (resultado.status < 200 || resultado.status >= 300) {
		return {
			status: resultado.status,
			data: [] as Application[],
			totalCount: 0,
			errorMessage: await readErrorMessage(resultado)
		};
	}

	const rawData = await resultado.json();
	const typed = rawData as ODataResponse<Application>;
	const data = typed.value ?? (rawData as Application[]);

	return {
		status: resultado.status,
		data,
		totalCount: typed["@odata.count"] ?? data.length
	};
}

export async function getApplicationByClientId(clientId: string) {
	const escapedClientId = clientId.replace(/'/g, "''");
	const resultado = await getOData(`$filter=clientId eq '${escapedClientId}'`);

	return {
		status: resultado.status,
		data: resultado.data[0] ?? null
	};
}

export async function getApplicationById(id: string) {
	const resultado = await fetch(`${URL_API}/api/applications/${id}`, {
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
		data: data as Application | null
	};
}

export async function createApplication(application: ApplicationCreateRequest) {
	const resultado = await fetch(`${URL_API}/api/applications`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify(application)
	});

	if (resultado.status < 200 || resultado.status >= 300) {
		return {
			status: resultado.status,
			data: null,
			errorMessage: await readErrorMessage(resultado)
		};
	}

	let data: Application | null = null;

	if (resultado.status !== 204) {
		const contentType = resultado.headers.get("content-type") ?? "";
		if (contentType.includes("application/json")) {
			data = (await resultado.json()) as Application;
		}
	}

	return {
		status: resultado.status,
		data
	};
}

export async function updateApplication(application: Application) {
	const resultado = await fetch(`${URL_API}/api/applications/${application.id}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify(application)
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
		data: data as Application | null
	};
}

export async function deleteApplication(id: string) {
	const resultado = await fetch(`${URL_API}/api/applications/${id}`, {
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
