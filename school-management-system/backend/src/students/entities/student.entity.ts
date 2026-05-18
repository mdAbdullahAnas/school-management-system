import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
import { Result } from '../../results/entities/result.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Subject } from '../../subjects/entities/subject.entity';


@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  studentId!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;

  // 👤 One student = one user account
  @OneToOne(() => User, { eager: true, cascade: true })
  @JoinColumn()
  user!: User;

  // 🏫 Many students belong to one class
  @ManyToOne(() => Class, (classroom) => classroom.students, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  classroom!: Class;

  // 📊 One student → many results
  @OneToMany(() => Result, (result) => result.student)
  results!: Result[];

  // 📅 One student → many attendance records
  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendance!: Attendance[];

  // 📘 One student → many subjects
  @ManyToMany(() => Subject, (subject) => subject.students)
  @JoinTable()
  subjects!: Subject[];
}