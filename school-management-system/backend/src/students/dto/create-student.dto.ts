export class CreateStudentDto {
  studentId!: string;
  phone!: string;
  address!: string;

  user!: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
  };
}