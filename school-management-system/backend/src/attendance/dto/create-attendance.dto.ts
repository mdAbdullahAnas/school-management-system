import {
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';

import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @IsDateString()
  date!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsNumber()
  studentId!: number;

  @IsNumber()
  subjectId!: number;
}