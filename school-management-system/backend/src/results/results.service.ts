import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Result } from './entities/result.entity';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';

import { User, Role } from '../users/entities/user.entity';

import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultRepo: Repository<Result>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  // GRADE CALCULATOR
  calculateGrade(marks: number) {
    if (marks >= 90) return 'A+';
    if (marks >= 85) return 'A';
    if (marks >= 80) return 'B+';
    if (marks >= 75) return 'B';
    if (marks >= 70) return 'C+';
    if (marks >= 65) return 'C';
    if (marks >= 60) return 'D+';
    if (marks >= 50) return 'D';
    return 'F';
  }

  // CREATE RESULT
  async create(
  dto: CreateResultDto,
  currentUser: User,
) {
  // FIND STUDENT
  const student =
    await this.studentRepo.findOne({
      where: {
        id: dto.studentId,
      },
      relations: ['subjects'],
    });

  if (!student) {
    throw new NotFoundException(
      'Student not found',
    );
  }

  // FIND SUBJECT
  const subject =
    await this.subjectRepo.findOne({
      where: {
        id: dto.subjectId,
      },
    });

  if (!subject) {
    throw new NotFoundException(
      'Subject not found',
    );
  }

  // CHECK ENROLLMENT
  const enrolled =
    student.subjects.some(
      (s) => s.id === dto.subjectId,
    );

  if (!enrolled) {
    throw new NotFoundException(
      'Student did not enroll in this subject',
    );
  }

  // CREATE RESULT
  const result = this.resultRepo.create({
    marks: dto.marks,
    examType: dto.examType,
    grade: this.calculateGrade(
      dto.marks,
    ),
    student,
    subject,
    givenBy: currentUser,
  });

  return this.resultRepo.save(result);
}

  // ALL RESULTS
  async findAll() {
    return this.resultRepo.find({
      relations: [
        'student',
        'student.user',
        'subject',
        'subject.teacher',
        'subject.teacher.user',
      ],
    });
  }

  // SINGLE RESULT
  async findOne(id: number) {
    const result =
      await this.resultRepo.findOne({
        where: { id },
        relations: [
          'student',
          'student.user',
          'subject',
          'subject.teacher',
        ],
      });

    if (!result) {
      throw new NotFoundException(
        'Result not found',
      );
    }

    return result;
  }

  // UPDATE
  async update(
    id: number,
    dto: UpdateResultDto,
  ) {
    const result = await this.findOne(id);

    if (dto.marks) {
      result.marks = dto.marks;

      result.grade =
        this.calculateGrade(
          dto.marks,
        );
    }

    result.examType =
      dto.examType ??
      result.examType;

    await this.resultRepo.save(result);

    return this.findOne(id);
  }

  // DELETE
  async remove(id: number) {
    const result = await this.findOne(id);

    await this.resultRepo.remove(result);

    return {
      message:
        'Result deleted successfully',
    };
  }

  // STUDENT RESULTS
  async getStudentResults(
    studentId: number,
  ) {
    return this.resultRepo.find({
      where: {
        student: {
          id: studentId,
        },
      },
      relations: [
        'subject',
        'subject.teacher',
      ],
    });
  }
}