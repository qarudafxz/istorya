export const buildUrl = (endpoint: string) => {
	return import.meta.env.DEV
		? `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api${endpoint}`
		: `/api${endpoint}`;
};
