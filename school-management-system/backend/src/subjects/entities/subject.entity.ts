import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { Result } from '../../results/entities/result.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subjectName!: string;

  @Column({ unique: true })
  code!: string;

  // MANY SUBJECTS → ONE TEACHER
  @ManyToOne(
    () => Teacher,
    (teacher) => teacher.subjects,
    {
      eager: true,
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  teacher!: Teacher;

  // MANY SUBJECTS ↔ MANY STUDENTS
  @ManyToMany(
    () => Student,
    (student) => student.subjects,
  )
  students!: Student[];

  @OneToMany(
  () => Result,
  (result) => result.subject,
  )
  results!: Result[];

  @OneToMany(
    () => Attendance,
    (attendance) => attendance.subject,
  )
  attendance!: Attendance[];


  @OneToMany(() => Assignment, (assignment) => assignment.subject)
assignments!: Assignment[];
}
