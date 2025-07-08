import { User } from './User';
import { UserDTO } from './UserDTO';

export function adaptUserDto(dto: UserDTO): User {
	return {
		id: dto.id,
		name: dto.name,
		email: dto.email
	};
}
