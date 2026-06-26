import type { User, UserCreateRequest } from "../Types/User";
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

export async function getUsers() {
	const resultado = await fetchWithAuth(`${URL_API}/api/Users`, {
		method: "GET"
	});

	if (resultado.status < 200 || resultado.status >= 300) {
		return {
			status: resultado.status,
			data: [] as User[],
			errorMessage: await readErrorMessage(resultado)
		};
	}

	const data = resultado.status === 204 ? [] : await resultado.json();

	return {
		status: resultado.status,
		data: data as User[]
	};
}

export async function getOData(query?: string) {
	const queryString = query ? `?${query}` : "";
	const resultado = await fetchWithAuth(`${URL_API}/api/Users/getOData${queryString}`, {
		method: "GET"
	});

	if (resultado.status < 200 || resultado.status >= 300) {
		return {
			status: resultado.status,
			data: [] as User[],
			totalCount: 0,
			errorMessage: await readErrorMessage(resultado)
		};
	}

	const rawData = await resultado.json();
	const typed = rawData as ODataResponse<User>;
	const data = typed.value ?? (rawData as User[]);

	return {
		status: resultado.status,
		data,
		totalCount: typed["@odata.count"] ?? data.length
	};
}

export async function getUserById(id: string) {
	const resultado = await fetchWithAuth(`${URL_API}/api/Users/${id}`, {
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
		data: data as User | null
	};
}

export async function createUser(user: UserCreateRequest) {
	const resultado = await fetchWithAuth(`${URL_API}/api/Users`, {
		method: "POST",
		body: JSON.stringify(user)
	});

	if (resultado.status < 200 || resultado.status >= 300) {
		return {
			status: resultado.status,
			data: null,
			errorMessage: await readErrorMessage(resultado)
		};
	}

	let data: User | null = null;
	if (resultado.status !== 204) {
		const rawBody = await resultado.text();
		if (rawBody) {
			data = JSON.parse(rawBody) as User;
		}
	}

	return {
		status: resultado.status,
		data
	};
}

export async function updateUser(user: User) {
	const resultado = await fetchWithAuth(`${URL_API}/api/Users/${user.id}`, {
		method: "PUT",
		body: JSON.stringify(user)
	});

	if (resultado.status < 200 || resultado.status >= 300) {
		return {
			status: resultado.status,
			data: null,
			errorMessage: await readErrorMessage(resultado)
		};
	}

	let data: User | null = null;
	if (resultado.status !== 204) {
		const rawBody = await resultado.text();
		if (rawBody) {
			data = JSON.parse(rawBody) as User;
		}
	}

	return {
		status: resultado.status,
		data
	};
}

export async function deleteUser(id: string) {
	const resultado = await fetchWithAuth(`${URL_API}/api/Users/${id}`, {
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
