import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTenant } from 'src/app/providers/TenantProvider';
import { adaptUserDto } from '../types/adapters';
import { User } from '../types/User';
import { UserDTO } from '../types/USerDTO';

export const getUsers = async (): Promise<User[]> => {
	const response = await axios.get<UserDTO[]>('/users');
	return response.data.map(adaptUserDto);
};

export const useUsers = () => {
	const { tenantSubdomain, isTenantResolved } = useTenant();

	return useQuery({
		queryKey: ['users', tenantSubdomain], // Aislamiento de cache por tenant
		queryFn: getUsers, // La función que hace la llamada API
		enabled: isTenantResolved, // Los datos se consideran "stale" después de 5 minutos
		staleTime: 5 * 60 * 1000 // Los datos se consideran "stale" después de 5 minutos
	});
};
