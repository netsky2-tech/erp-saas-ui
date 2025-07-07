import apiService from 'app/store/apiService';
import { adaptUserDto } from '../types/adapters';
import { User } from '../types/User';
import { UserDTO } from '../types/UserDTO';

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
			transformResponse: (response: UserDTO[]) => {
				return response.map(adaptUserDto);
			},
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: USER_TAG, id })), { type: USER_TAG, id: 'LIST' }]
					: [{ type: USER_TAG, id: 'LIST' }]
		}),
		createUser: builder.mutation<User, Partial<User>>({
			query: (newUser) => ({
				url: '/users',
				method: 'POST',
				body: newUser
			}),
			invalidatesTags: [{ type: USER_TAG, id: 'LIST' }],
			transformResponse: (response: UserDTO) => adaptUserDto(response)
		})
	}),
	overrideExisting: true
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;
