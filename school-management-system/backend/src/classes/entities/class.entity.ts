import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Student } from '../../students/entities/student.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  className!: string;

  @Column()
  section!: string;

  @OneToMany(() => Student, (student) => student.classroom)
  students!: Student[];
}