export class CreateSubjectDto {
  subjectName!: string;
  code!: string;

  // teacher id
  teacherId!: number;

  // optional students
  studentIds?: number[];
}