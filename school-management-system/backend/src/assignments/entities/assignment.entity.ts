import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { Subject } from '../../subjects/entities/subject.entity';
import { User } from '../../users/entities/user.entity';
import { AssignmentSubmission } from './assignment-submission.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  deadline!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  // SUBJECT
  @ManyToOne(() => Subject, (subject) => subject.assignments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  subject!: Subject;

  // CREATED BY (TEACHER / ADMIN)
  @ManyToOne(() => User, {
    eager: true,
  })
  createdBy!: User;

  // SUBMISSIONS
  @OneToMany(
    () => AssignmentSubmission,
    (submission) => submission.assignment,
  )
  submissions!: AssignmentSubmission[];
  @ManyToOne(() => Teacher, (teacher) => teacher.assignments)
teacher!: Teacher;
}