import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto {
  subjectName?: string;
  code?: string;
  teacherId?: number;
  studentIds?: number[];
}