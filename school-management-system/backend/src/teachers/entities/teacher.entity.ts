import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';
@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  designation!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  address!: string; // ✅ ADD THIS

  @OneToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Subject, (subject) => subject.teacher)

  subjects!: Subject[];
    @OneToMany(() => Assignment, (assignment) => assignment.teacher)
     assignments!: Assignment[];
}