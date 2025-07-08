import { TableCell, TableContainer, TableHead, TablePagination, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User } from '../types/User';

interface UserListTableProps {
	users: User[];
}

function UserListTable({ users }: UserListTableProps) {
	const navigate = useNavigate();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleEdit = (userId: string) => {
		navigate(`/users/edit/${userId}`);
	};

	const handleDelete = (user: User) => {
		setUserToDelete(user);
		setOpenDeleteDialog(true);
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
		setUserToDelete(null);
	};

	const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<Paper elevation={0}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table
					stickyHeader
					aria-label="user list table"
				>
					<TableHead>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Email</TableCell>
							<TableCell align="right">Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedUsers.map((user: User) => (
							<TableRow
								hover
								key={user.id}
							>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell align="right">
									<Tooltip title="Editar">
										<IconButton onClick={() => handleEdit(user.id)} />
									</Tooltip>
									<Tooltip title="Eliminar">
										<IconButton onClick={() => handleDelete(user)} />
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={users.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
			{userToDelete && (
				<UserDeleteDialog
					open={openDeleteDialog}
					onClose={handleCloseDeleteDialog}
					user={userToDelete}
				/>
			)}
		</Paper>
	);
}

export { UserListTable };
