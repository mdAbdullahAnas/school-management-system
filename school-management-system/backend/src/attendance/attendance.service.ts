import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  Attendance,
} from './entities/attendance.entity';

import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';
import {
  User,
  Role,
} from '../users/entities/user.entity';

import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  // TAKE ATTENDANCE
  async create(
    dto: CreateAttendanceDto,
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
        relations: [
          'teacher',
          'teacher.user',
        ],
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
      throw new BadRequestException(
        'Student not enrolled in this subject',
      );
    }

    // TEACHER CAN ONLY TAKE OWN SUBJECT
    if (
      currentUser.role === Role.TEACHER &&
      subject.teacher.user.id !==
        currentUser.id
    ) {
      throw new ForbiddenException(
        'You cannot take attendance for this subject',
      );
    }

    // CHECK DUPLICATE
    const existing =
      await this.attendanceRepo.findOne({
        where: {
          student: {
            id: dto.studentId,
          },
          subject: {
            id: dto.subjectId,
          },
          date: dto.date,
        },
      });

    if (existing) {
      throw new BadRequestException(
        'Attendance already taken',
      );
    }

    // SAVE
    const attendance =
      this.attendanceRepo.create({
        date: dto.date,
        status: dto.status,
        student,
        subject,
        givenBy: currentUser,
      });

    return this.attendanceRepo.save(
      attendance,
    );
  }

  // STUDENT ATTENDANCE
  async getStudentAttendance(
    studentId: number,
  ) {
    return this.attendanceRepo.find({
      where: {
        student: {
          id: studentId,
        },
      },
      relations: [
        'subject',
        'givenBy',
      ],
      order: {
        date: 'DESC',
      },
    });
  }
}