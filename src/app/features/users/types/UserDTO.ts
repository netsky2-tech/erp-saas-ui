export interface UserDTO {
	// backend representation snake_case
	items: { id: string; name: string; email: string }[];
}

export interface SingleUserDTO {
	id: string;
	name: string;
	email: string;
}
