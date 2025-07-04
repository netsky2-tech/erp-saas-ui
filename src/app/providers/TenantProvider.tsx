import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
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
			// Entorno de desarrollo local
			// Podemos definir un subdominio de prueba, o dejarlo nulo si el backend
			// permite un tenant por defecto para localhost.
			// Por ahora, lo dejaremos nulo y el backend lo manejará si es necesario.
			// O podríamos usar una variable de entorno para un subdominio de desarrollo.

			setTenantSubdomain(null); // O 'default' si tu backend tiene un tenant por defecto
		} else if (parts.length >= 2) {
			// Considera al menos 2 partes para subdominio.dominio.com
			// Asume que la primera parte es el subdominio si no es 'www'
			const potentialSubdomain = parts[0];
			if (potentialSubdomain !== 'www') {
				setTenantSubdomain(potentialSubdomain);
			} else if (parts.length >= 3) {
				// Si es www.subdominio.dominio.com
				setTenantSubdomain(parts[1]); // Podría ser el segundo segmento
			} else {
				setTenantSubdomain(null); // No se pudo determinar el subdominio
			}
		} else {
			setTenantSubdomain(null); // No hay subdominio claro
		}
		setIsTenantResolved(true);
	}, []);

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
