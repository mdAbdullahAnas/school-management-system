import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Assignment } from './entities/assignment.entity';
import { AssignmentSubmission } from './entities/assignment-submission.entity';

import { Subject } from '../subjects/entities/subject.entity';
import { Student } from '../students/entities/student.entity';
import { User, Role } from '../users/entities/user.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,

    @InjectRepository(AssignmentSubmission)
    private submissionRepo: Repository<AssignmentSubmission>,

    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  // CREATE ASSIGNMENT (TEACHER + ADMIN)
  async create(dto: any, user: User) {
    const subject = await this.subjectRepo.findOne({
  where: { id: dto.subjectId },
  relations: ['teacher', 'teacher.user'],
});

    if (!subject) throw new NotFoundException('Subject not found');

    // teacher restriction
    if (
      user.role === Role.TEACHER &&
      subject.teacher.user.id !== user.id
    ) {
      throw new ForbiddenException('Not your subject');
    }

    const assignment = this.assignmentRepo.create({
      title: dto.title,
      description: dto.description,
      deadline: dto.deadline,
      subject,
      createdBy: user,
    });

    return this.assignmentRepo.save(assignment);
  }

  // GET ALL ASSIGNMENTS
  findAll() {
    return this.assignmentRepo.find({
      relations: ['subject', 'createdBy'],
    });
  }

  // SUBMIT ASSIGNMENT (STUDENT)
  async submit(dto: any, studentId: number) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: dto.assignmentId },
      relations: ['subject'],
    });

    if (!assignment)
      throw new NotFoundException('Assignment not found');

    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['subjects'],
    });

    if (!student)
      throw new NotFoundException('Student not found');

    // CHECK ENROLLMENT
    const enrolled = student.subjects.some(
      (s) => s.id === assignment.subject.id,
    );

    if (!enrolled)
      throw new BadRequestException('Not enrolled in this subject');

    const submission = this.submissionRepo.create({
      assignment,
      student,
      fileUrl: dto.fileUrl,
      textAnswer: dto.textAnswer,
    });

    return this.submissionRepo.save(submission);
  }

  // TEACHER VIEW SUBMISSIONS
  async getSubmissions(assignmentId: number) {
    return this.submissionRepo.find({
      where: {
        assignment: { id: assignmentId },
      },
      relations: ['student', 'student.user'],
    });
  }

  // STUDENTS WHO NOT SUBMITTED
  async getPendingStudents(assignmentId: number) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
      relations: ['subject', 'subject.students'],
    });

    if (!assignment)
      throw new NotFoundException('Assignment not found');

    const submissions = await this.submissionRepo.find({
      where: { assignment: { id: assignmentId } },
      relations: ['student'],
    });

    const submittedIds = submissions.map(
      (s) => s.student.id,
    );

    return assignment.subject.students.filter(
      (s) => !submittedIds.includes(s.id),
    );
  }
}