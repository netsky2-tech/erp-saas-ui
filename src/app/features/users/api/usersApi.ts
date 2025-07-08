import apiService from 'app/store/apiService';
import { adaptSingleUserDto, adaptUserDto } from '../types/adapters';
import { User } from '../types/User';
import { SingleUserDTO, UserDTO } from '../types/UserDTO';

interface GetUsersQueryParams {
	// parametros de filtrado y paginacion
	page?: number;
	search?: string;
}

const sanitizeParams = (params?: GetUsersQueryParams) => {
	return {
		page: params?.page ?? 1,
		search: params?.search.trim() ?? ''
	};
};

export const USER_TAG = 'User';

// Inyeccion de endpoints en apiService global
export const usersApi = apiService.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query<User[], GetUsersQueryParams | void>({
			query: (params: GetUsersQueryParams) => ({
				url: '/users',
				method: 'GET',
				params: sanitizeParams(params)
			}),
			transformResponse: (response: UserDTO) => {
				return adaptUserDto(response);
			},
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: USER_TAG, id }) as const), { type: USER_TAG, id: 'LIST' }]
					: [{ type: USER_TAG, id: 'LIST' }]
		}),
		getUserById: builder.query<User, string>({
			query: (id) => ({
				url: `/users/${id}`
			}),
			transformResponse: (response: SingleUserDTO) => adaptSingleUserDto(response),
			providesTags: (result, error, id) => [{ type: 'User', id }] // Provee el tag específico del ID del usuario
		}),
		createUser: builder.mutation<User, Partial<User>>({
			query: (newUser) => ({
				url: '/users',
				method: 'POST',
				body: newUser
			}),
			invalidatesTags: [{ type: USER_TAG, id: 'LIST' }],
			transformResponse: (response: SingleUserDTO) => adaptSingleUserDto(response)
		}),
		updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
			// Requiere el ID y los datos a actualizar
			query: ({ id, ...patch }) => ({
				url: `/users/${id}`,
				method: 'PUT', // O PATCH, según tu API de Laravel
				data: patch
			}),
			transformResponse: (response: SingleUserDTO) => adaptSingleUserDto(response),
			// Invalida la lista y el usuario específico después de la actualización
			invalidatesTags: (result, error, { id }) => [
				{ type: 'User', id: 'LIST' },
				{ type: 'User', id }
			]
		}),
		// Nuevo: Endpoint para eliminar un usuario
		deleteUser: builder.mutation<void, string>({
			// Recibe el ID del usuario a eliminar
			query: (id) => ({
				url: `/users/${id}`,
				method: 'DELETE'
			}),
			// Invalida la lista y el usuario específico después de la eliminación
			invalidatesTags: (result, error, id) => [
				{ type: 'User', id: 'LIST' },
				{ type: 'User', id }
			]
		})
	}),
	overrideExisting: true
});

export const {
	useGetUsersQuery,
	useGetUserByIdQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation
} = usersApi;
