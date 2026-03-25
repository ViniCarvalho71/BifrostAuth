import type { User, UserCreateRequest } from "../Types/User";

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

export async function getUsers() {
	const resultado = await fetch(`${URL_API}/api/Users`, {
		method: "GET",
		headers: getAuthHeaders()
	});

	const data = resultado.status === 204 ? [] : await resultado.json();

	return {
		status: resultado.status,
		data: data as User[]
	};
}

export async function getOData(query?: string) {
	const queryString = query ? `?${query}` : "";
	const resultado = await fetch(`${URL_API}/api/Users/getOData${queryString}`, {
		method: "GET",
		headers: getAuthHeaders()
	});

	if (resultado.status !== 200) {
		return {
			status: resultado.status,
			data: [] as User[]
		};
	}

	const rawData = await resultado.json();
	const data = (rawData as ODataResponse<User>).value ?? (rawData as User[]);

	return {
		status: resultado.status,
		data
	};
}

export async function getUserById(id: string) {
	const resultado = await fetch(`${URL_API}/api/Users/${id}`, {
		method: "GET",
		headers: getAuthHeaders()
	});

	const data = resultado.status === 204 ? null : await resultado.json();

	return {
		status: resultado.status,
		data: data as User | null
	};
}

export async function createUser(user: UserCreateRequest) {
	const resultado = await fetch(`${URL_API}/api/Users`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify(user)
	});

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
	const resultado = await fetch(`${URL_API}/api/Users/${user.id}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify(user)
	});

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
	const resultado = await fetch(`${URL_API}/api/Users/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	});

	return {
		status: resultado.status
	};
}
