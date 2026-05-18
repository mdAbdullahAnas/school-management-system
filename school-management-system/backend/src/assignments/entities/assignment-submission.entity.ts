import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { Assignment } from './assignment.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
@Unique(['assignment', 'student'])
export class AssignmentSubmission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  fileUrl!: string;

  @Column({ nullable: true })
  textAnswer!: string;

  @CreateDateColumn()
  submittedAt!: Date;

  @Column({
    default: 'submitted',
  })
  status!: 'submitted' | 'late';

  // RELATION
  @ManyToOne(
    () => Assignment,
    (assignment) => assignment.submissions,
    {
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  assignment!: Assignment;

  @ManyToOne(
    () => Student,
    (student) => student.id,
    {
      eager: true,
    },
  )
  student!: Student;
}