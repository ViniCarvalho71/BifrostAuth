import type { Application, ApplicationCreateRequest } from "../Types/Application.ts";

const URL_API = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

type ODataResponse<T> = {
	value?: T[];
};

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem("token");

	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}

export async function getApplications() {
	const resultado = await fetch(`${URL_API}/api/applications`, {
		method: "GET",
		headers: getAuthHeaders()
	});

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

	if (resultado.status !== 200) {
		return {
			status: resultado.status,
			data: [] as Application[]
		};
	}

	const rawData = await resultado.json();
	const data = (rawData as ODataResponse<Application>).value ?? (rawData as Application[]);

	return {
		status: resultado.status,
		data
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

	const data = resultado.status === 204 ? null : await resultado.json();

	return {
		status: resultado.status,
		data: data as Application | null
	};
}

export async function updateApplication(application: Application) {
	const resultado = await fetch(`${URL_API}/api/applications/${application.id}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify(application)
	});

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

	return {
		status: resultado.status
	};
}
