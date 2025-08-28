type Tokens = { accessToken: string; refreshToken: string; expiresAt: number };
type Tenant = { companyId?: string; branchId?: string };

let __session: { tokens?: Tokens; tenant?: Tenant } | null = null;

export const getSession = () => __session;
export const setSession = (s: { tokens?: Tokens; tenant?: Tenant }) => {
	__session = s;
};
export const clearSession = () => {
	__session = null;
};
export const tryRefresh = async (): Promise<{ tokens: Tokens }> => {
	// Delegar en authRepo.refresh(); retornar { tokens }
	const { tokens } = await import('../../modules/auth/infra/repo').then((m) => m.authRepo.refresh());
	return { tokens };
};
