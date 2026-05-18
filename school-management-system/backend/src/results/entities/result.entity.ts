import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { User } from '../../users/entities/user.entity';


@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'float',
  })
  marks!: number;

  @Column()
  grade!: string;

  @Column({
    nullable: true,
  })
  examType!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // MANY RESULTS → ONE STUDENT
  @ManyToOne(
    () => Student,
    (student) => student.results,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  student!: Student;

  // MANY RESULTS → ONE SUBJECT
  @ManyToOne(
    () => Subject,
    (subject) => subject.results,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  subject!: Subject;

    // WHO CREATED RESULT
  @ManyToOne(() => User, {
    eager: true,
    nullable: true,
  })
  givenBy!: User;
}