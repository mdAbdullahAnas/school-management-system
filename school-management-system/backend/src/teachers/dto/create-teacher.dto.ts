import { Role } from '../../users/entities/user.entity';

export class CreateTeacherDto {
  designation!: string;
  phone!: string;
  address!: string;

  user!: {
    fullName: string;
    email: string;
    password: string;
    role: Role;
  };
}