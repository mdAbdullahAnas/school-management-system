import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Student } from './entities/student.entity';
import { User, Role } from '../users/entities/user.entity';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // 🟢 CREATE
  async create(dto: CreateStudentDto) {
  const { user, ...studentData } = dto;

  // 🔥 CHECK IF USER EXISTS
  const existingUser = await this.userRepo.findOne({
    where: { email: user.email },
  });

  if (existingUser) {
    throw new Error('User email already exists');
  }

  // create user
  const hashedPassword = await bcrypt.hash(
  user.password,
  10,
  );

  const newUser = this.userRepo.create({
  fullName: user.fullName,
  email: user.email,
  password: hashedPassword,
  role: Role.STUDENT,
   });

  await this.userRepo.save(newUser);

  // create student
  const student = this.studentRepo.create({
    ...studentData,
    user: newUser,
  });

  return this.studentRepo.save(student);
}

  // 🟡 GET ALL
  async findAll(search?: string) {
    const where = search ? [
      { user: { fullName: Like(`%${search}%`) } },
      { rollNumber: Like(`%${search}%`) }
    ] : {};

    return this.studentRepo.find({
      where,
      relations: ['user', 'classroom', 'subjects', 'results', 'attendance'],
    });
  }

  // 🔵 GET ONE
  async findOne(id: number) {
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: ['user', 'classroom', 'subjects', 'results', 'attendance'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  // 🟠 UPDATE
  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);

    if (dto.fullName) {
      student.user.fullName = dto.fullName;
      await this.userRepo.save(student.user);
    }

    student.phone = dto.phone ?? student.phone;
    student.address = dto.address ?? student.address;
    student.rollNumber = dto.rollNumber ?? student.rollNumber;

    await this.studentRepo.save(student);

    return this.findOne(id);
  }

  // 🔴 DELETE
  async remove(id: number) {
    const student = await this.findOne(id);
    return this.studentRepo.remove(student);
  }
}