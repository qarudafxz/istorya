export const buildUrl = (endpoint: string) => {
	return import.meta.env.DEV
		? `http://localhost:8000/api${endpoint}`
		: `/api${endpoint}`;
};
