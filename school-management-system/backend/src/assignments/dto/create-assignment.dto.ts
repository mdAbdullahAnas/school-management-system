import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  deadline!: Date;

  @IsNumber()
  subjectId!: number;
}