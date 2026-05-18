import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, In } from 'typeorm';

import { Subject } from './entities/subject.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Student } from '../students/entities/student.entity';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,

    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  // CREATE SUBJECT
  async create(dto: CreateSubjectDto) {
    // CHECK SUBJECT CODE
    const existing = await this.subjectRepo.findOne({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(
        'Subject code already exists',
      );
    }

    // FIND TEACHER
    const teacher = await this.teacherRepo.findOne({
      where: { id: dto.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(
        'Teacher not found',
      );
    }

    // FIND STUDENTS
    let students: Student[] = [];

    if (
      dto.studentIds &&
      dto.studentIds.length > 0
    ) {
      students = await this.studentRepo.find({
        where: {
          id: In(dto.studentIds),
        },
      });
    }

    // CREATE SUBJECT
    const subject = this.subjectRepo.create({
      subjectName: dto.subjectName,
      code: dto.code,
      teacher,
      students,
    });

    return this.subjectRepo.save(subject);
  }

  // GET ALL
  async findAll(teacherId?: number, studentId?: number) {
    const where: any = {};
    if (teacherId) where.teacher = { id: teacherId };
    if (studentId) where.students = { id: studentId };

    return this.subjectRepo.find({
      where,
      relations: [
        'teacher',
        'teacher.user',
        'students',
        'students.user',
      ],
    });
  }

  // ENROLL STUDENT
  async enroll(subjectId: number, studentId: number) {
    const subject = await this.subjectRepo.findOne({
      where: { id: subjectId },
      relations: ['students'],
    });

    if (!subject) throw new NotFoundException('Subject not found');

    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const isEnrolled = subject.students.some(s => s.id === studentId);
    if (!isEnrolled) {
      subject.students.push(student);
      await this.subjectRepo.save(subject);
    }

    return { message: 'Enrolled successfully' };
  }

  // GET ONE
  async findOne(id: number) {
    const subject = await this.subjectRepo.findOne({
      where: { id },
      relations: [
        'teacher',
        'teacher.user',
        'students',
        'students.user',
      ],
    });

    if (!subject) {
      throw new NotFoundException(
        'Subject not found',
      );
    }

    return subject;
  }

  // UPDATE
  async update(
    id: number,
    dto: UpdateSubjectDto,
  ) {
    const subject = await this.findOne(id);

    // UPDATE TEACHER
    if (dto.teacherId) {
      const teacher =
        await this.teacherRepo.findOne({
          where: {
            id: dto.teacherId,
          },
        });

      if (!teacher) {
        throw new NotFoundException(
          'Teacher not found',
        );
      }

      subject.teacher = teacher;
    }

    // UPDATE STUDENTS
    if (dto.studentIds) {
      const students =
        await this.studentRepo.find({
          where: {
            id: In(dto.studentIds),
          },
        });

      subject.students = students;
    }

    subject.subjectName =
      dto.subjectName ??
      subject.subjectName;

    subject.code =
      dto.code ?? subject.code;

    await this.subjectRepo.save(subject);

    return this.findOne(id);
  }

  // DELETE
  async remove(id: number) {
    const subject = await this.findOne(id);

    await this.subjectRepo.remove(subject);

    return {
      message: 'Subject deleted successfully',
    };
  }

  // ADD STUDENTS TO SUBJECT


  async addStudents(subjectId: number, studentIds: number[]) {
  const subject = await this.subjectRepo.findOne({
    where: { id: subjectId },
    relations: ['students'],
  });

  if (!subject) {
    throw new NotFoundException('Subject not found');
  }

  const students = await this.studentRepo.findByIds(studentIds);

  subject.students = [
    ...subject.students,
    ...students.filter(
      (s) => !subject.students.find((ex) => ex.id === s.id),
    ),
  ];

  return this.subjectRepo.save(subject);
}
  
}