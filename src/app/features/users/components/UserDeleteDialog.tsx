import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material';
import { useDeleteUserMutation } from '../api/usersApi';
import { User } from '../types/User';

interface UserDeleteDialogProps {
	open: boolean;
	onClose: () => void;
	user: User;
}

// **NOTA:** Debes agregar useDeleteUserMutation a usersApi.ts
// Ver ejemplo de usersApi.ts más abajo.

function UserDeleteDialog({ open, onClose, user }: UserDeleteDialogProps) {
	const [deleteUser, { isLoading }] = useDeleteUserMutation();

	const handleDeleteConfirm = async () => {
		try {
			await deleteUser(user.id).unwrap();
			// enqueueSnackbar(`Usuario "${user.name}" eliminado exitosamente.`, { variant: 'success' });
			onClose();
		} catch (error: any) {
			console.error('Error al eliminar usuario:', error);
			// enqueueSnackbar(error?.data?.message || 'Error al eliminar usuario.', { variant: 'error' });
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="delete-user-title"
			aria-describedby="delete-user-description"
		>
			<DialogTitle id="delete-user-title">Confirmar Eliminación</DialogTitle>
			<DialogContent>
				<DialogContentText id="delete-user-description">
					¿Estás seguro de que quieres eliminar al usuario "{user.name}"? Esta acción no se puede deshacer.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					disabled={isLoading}
				>
					Cancelar
				</Button>
				<Button
					onClick={handleDeleteConfirm}
					color="error"
					disabled={isLoading}
				>
					{isLoading ? <CircularProgress size={24} /> : 'Eliminar'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default UserDeleteDialog;
