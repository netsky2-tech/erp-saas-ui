import FusePageCarded from '@fuse/core/FusePageCarded';
import { Box, Typography } from '@mui/material';
// Para notificaciones de Fuse
import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../api/usersApi';
import UserForm from '../components/UserForm';

function UserCreatePage() {
	const navigate = useNavigate();
	const [createUser, { isLoading }] = useCreateUserMutation();

	const handleSubmit = async (data: any) => {
		// 'any' por simplicidad, usa tu tipo de input para crear
		try {
			await createUser(data).unwrap();
			// enqueueSnackbar('Usuario creado exitosamente!', { variant: 'success' });
			navigate('/users'); // Redirige a la lista de usuarios
		} catch (error: any) {
			console.error('Error al crear usuario:', error);
			// enqueueSnackbar(error?.data?.message || 'Error al crear usuario.', { variant: 'error' });
		}
	};

	return (
		<FusePageCarded
			header={<Typography variant="h6">Crear Nuevo Usuario</Typography>}
			content={
				<Box className="p-24 max-w-lg mx-auto">
					<UserForm
						onSubmit={handleSubmit}
						isSubmitting={isLoading}
						submitButtonText="Crear Usuario"
					/>
				</Box>
			}
		/>
	);
}

export default UserCreatePage;
