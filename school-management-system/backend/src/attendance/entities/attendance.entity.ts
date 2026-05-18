import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { User } from '../../users/entities/user.entity';

export enum AttendanceStatus {
  PRESENT = 'P',
  ABSENT = 'A',
  LEAVE = 'L',
}

@Entity()
@Unique([
  'student',
  'subject',
  'date',
])
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'date',
  })
  date!: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
  })
  status!: AttendanceStatus;

  // MANY ATTENDANCE → ONE STUDENT
  @ManyToOne(
    () => Student,
    (student) => student.attendance,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  student!: Student;

  // MANY ATTENDANCE → ONE SUBJECT
  @ManyToOne(
    () => Subject,
    (subject) => subject.attendance,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  subject!: Subject;

  // WHO TOOK ATTENDANCE
  @ManyToOne(() => User, {
    eager: true,
    nullable: true,
  })
  givenBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}