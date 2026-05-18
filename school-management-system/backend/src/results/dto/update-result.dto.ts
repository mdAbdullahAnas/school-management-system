import { PartialType } from '@nestjs/swagger';
import { CreateResultDto } from './create-result.dto';
export class UpdateResultDto {
  marks?: number;
  examType?: string;
}