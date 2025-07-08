import FusePageCarded from '@fuse/core/FusePageCarded';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../api/usersApi';
import UserForm from '../components/UserForm';

// **NOTA:** Debes agregar useGetUserByIdQuery y useUpdateUserMutation a usersApi.ts
// Ver ejemplo de usersApi.ts más abajo.

function UserEditPage() {
	const { userId } = useParams<{ userId: string }>(); // Obtiene el ID del usuario de la URL
	const navigate = useNavigate();

	// Obtener los datos del usuario para editar
	const {
		data: user,
		isLoading: isLoadingUser,
		isError: isUserError,
		error: userError
	} = useGetUserByIdQuery(userId, {
		skip: !userId // No ejecutar la query si no hay userId
	});

	// Hook para la mutación de actualización
	const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

	const handleSubmit = async (data: any) => {
		// 'any' por simplicidad, usa tu tipo de input para actualizar
		if (!userId) return;
		try {
			// Combina los datos actuales con los del formulario para la actualización
			await updateUser({ id: userId, ...data }).unwrap();
			// enqueueSnackbar('Usuario actualizado exitosamente!', { variant: 'success' });
			navigate('/users');
		} catch (error: any) {
			console.error('Error al actualizar usuario:', error);
			// enqueueSnackbar(error?.data?.message || 'Error al actualizar usuario.', { variant: 'error' });
		}
	};

	if (isLoadingUser) {
		return (
			<FusePageCarded
				header={<Typography variant="h6">Cargando Usuario...</Typography>}
				content={
					<Box className="flex justify-center items-center h-full">
						<CircularProgress />
					</Box>
				}
			/>
		);
	}

	if (isUserError) {
		return (
			<FusePageCarded
				header={<Typography variant="h6">Error</Typography>}
				content={
					<Box className="p-24">
						<Alert severity="error">
							Error al cargar el usuario: {userError?.message || 'Usuario no encontrado'}
						</Alert>
					</Box>
				}
			/>
		);
	}

	if (!user) {
		return (
			<FusePageCarded
				header={<Typography variant="h6">Usuario no encontrado</Typography>}
				content={
					<Box className="p-24">
						<Typography>El usuario con ID "{userId}" no existe.</Typography>
					</Box>
				}
			/>
		);
	}

	return (
		<FusePageCarded
			header={<Typography variant="h6">Editar Usuario: {user.fullName}</Typography>}
			content={
				<Box className="p-24 max-w-lg mx-auto">
					<UserForm
						initialData={user}
						onSubmit={handleSubmit}
						isSubmitting={isUpdatingUser}
						submitButtonText="Guardar Cambios"
					/>
				</Box>
			}
		/>
	);
}

export default UserEditPage;
