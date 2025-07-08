import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface TenantContextType {
	tenantSubdomain: string | null;
	isTenantResolved: boolean; // Para indicar cuando el subdominio ya ha sido resuelto
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }): React.ReactElement {
	const [tenantSubdomain, setTenantSubdomain] = useState<string | null>(null);
	const [isTenantResolved, setIsTenantResolved] = useState<boolean>(false);

	useEffect(() => {
		const { hostname } = window.location;
		const parts = hostname.split('.');

		if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
			console.warn('Running on localhost. Tenant subdomain detection might be limited for direct URL access.');
		} else if (parts.length >= 3 && parts[0] !== 'www') {
			setTenantSubdomain(parts[0]);
		} else if (parts.length >= 2 && parts[0] === 'www' && parts.length >= 3) {
			setTenantSubdomain(parts[1]);
		}

		setIsTenantResolved(true);
	}, []);

	useEffect(() => {
		if (isTenantResolved) {
			const { hostname } = window.location;
			const baseDomain = import.meta.env.VITE_APP_BASE_DOMAIN;
			let apiBaseUrl: string;

			if (tenantSubdomain && baseDomain) {
				apiBaseUrl = `http://${tenantSubdomain}.${baseDomain}/api`;
			} else {
				apiBaseUrl = `http://${baseDomain}/api`;
			}

			axios.defaults.baseURL = apiBaseUrl;
		}
	}, [tenantSubdomain, isTenantResolved]);

	const value = useMemo(
		() => ({
			tenantSubdomain,
			isTenantResolved
		}),
		[tenantSubdomain, isTenantResolved]
	);

	// Mientras el subdominio no se haya resuelto, podemos mostrar un loading o null
	if (!isTenantResolved) {
		return <FuseSplashScreen />;
	}

	return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export const useTenant = () => {
	const context = useContext(TenantContext);
	if (context === undefined) {
		throw new Error('useTenant must be used within a TenantProvider');
	}
	return context;
};
