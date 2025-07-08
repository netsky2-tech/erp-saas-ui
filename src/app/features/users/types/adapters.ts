import { User } from './User';
import { UserDTO } from './UserDTO';

export function adaptUserDto(dto: UserDTO): User[] {
	return dto.items.map((item) => ({
		id: item.id,
		name: item.name,
		email: item.email
	}));
}

export function adaptSingleUserDto(dto: { id: string; name: string; email: string }): User {
	return {
		id: dto.id,
		name: dto.name,
		email: dto.email
	};
}
