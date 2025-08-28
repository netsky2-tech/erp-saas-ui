export const env = {
	API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
	TENANT_HEADER_COMPANY: 'X-Company-Id',
	TENANT_HEADER_BRANCH: 'X-Branch-Id'
} as const;
