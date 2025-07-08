import FusePageCarded from '@fuse/core/FusePageCarded';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../api/usersApi';
import { UserListTable } from '../components/UserListTable';

function UsersPage() {
	const { data: users, isLoading, isError, error } = useGetUsersQuery();

	if (isLoading) {
		return (
			<FusePageCarded
				header={<Typography variant="h6">Cargando usuarios...</Typography>}
				content={
					<Box className="flex justify-center items-center h-full">
						<CircularProgress />
					</Box>
				}
			/>
		);
	}

	if (isError) {
		return (
			<FusePageCarded
				header={<Typography variant="h6" />}
				content={
					<Box className="p-24">
						<Alert severity="error">
							Error al cargar los usuarios: {error?.message || 'Error desconocido'}
						</Alert>
					</Box>
				}
			/>
		);
	}

	return (
		<FusePageCarded
			header={
				<Box className="flex flex-row flex-1 items-center justify-between p-24 sm:p-32">
					<Typography variant="h6">Gestion de usuarios</Typography>
					<Button
						component={Link}
						to="/users/create"
						color="secondary"
						aria-label="add"
					>
						{' '}
						Añadir nuevo usuario
					</Button>
				</Box>
			}
			content={
				<Box className="p-24">
					{users && users.length > 0 ? (
						<UserListTable users={users} />
					) : (
						<Typography variant="body1">No hay usuarios registrados</Typography>
					)}
				</Box>
			}
		/>
	);
}

export default UsersPage;
