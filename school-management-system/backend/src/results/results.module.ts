import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Result } from './entities/result.entity';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';

import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Result,
      Student,
      Subject,
    ]),
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}