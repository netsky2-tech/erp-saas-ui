import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User } from '../types/User'; // Tu tipo de usuario

// Define el esquema de validación para el formulario
const userSchema = z.object({
	name: z.string().min(3, 'El nombre es requerido y debe contener al menos 3 caracteres.'),
	email: z.string().email('Debe ser un email válido.'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.').optional() // Si es para creación
});

type UserFormInputs = z.infer<typeof userSchema>;

interface UserFormProps {
	initialData?: User; // Para edición, pasamos los datos actuales del usuario
	onSubmit: (data: UserFormInputs) => void;
	isSubmitting: boolean;
	submitButtonText: string;
}

function UserForm({ initialData, onSubmit, isSubmitting, submitButtonText }: UserFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<UserFormInputs>({
		resolver: zodResolver(userSchema),
		defaultValues: initialData || {
			// Establece valores por defecto si los hay (para edición)
			name: '',
			email: ''
		}
	});

	// Para resetear el formulario si initialData cambia (útil en páginas de edición si navegas entre usuarios)
	useEffect(() => {
		if (initialData) {
			reset(initialData);
		}
	}, [initialData, reset]);

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				'& .MuiTextField-root': { mb: 2 }
			}}
		>
			<TextField
				{...register('name')}
				label="Nombre Completo"
				variant="outlined"
				fullWidth
				error={!!errors.name}
				helperText={errors.name?.message}
			/>
			<TextField
				{...register('email')}
				label="Correo Electrónico"
				variant="outlined"
				fullWidth
				error={!!errors.email}
				helperText={errors.email?.message}
			/>
			{/* Agrega más campos de formulario según tu User model */}
			{/* Ejemplo para la contraseña (solo si es para creación o cambio de contraseña) */}
			{/* {!initialData && ( // Solo muestra la contraseña para la creación
                <TextField
                    {...register('password')}
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
            )} */}

			<Button
				type="submit"
				variant="contained"
				color="primary"
				disabled={isSubmitting}
				fullWidth
				sx={{ mt: 2 }}
			>
				{isSubmitting ? <CircularProgress size={24} /> : submitButtonText}
			</Button>
		</Box>
	);
}

export default UserForm;
