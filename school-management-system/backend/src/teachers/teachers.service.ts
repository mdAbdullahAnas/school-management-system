import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Teacher } from './entities/teacher.entity';
import { User, Role } from '../users/entities/user.entity';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Assignment } from 'src/assignments/entities/assignment.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // CREATE TEACHER
  async create(dto: CreateTeacherDto) {
    const { user, ...teacherData } = dto;

    // CHECK EMAIL
    const existingUser = await this.userRepo.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      user.password,
      10,
    );

    // CREATE USER
    const newUser = this.userRepo.create({
      fullName: user.fullName,
      email: user.email,
      password: hashedPassword,
      role: Role.TEACHER,
    });

    await this.userRepo.save(newUser);

    // CREATE TEACHER
    const teacher = this.teacherRepo.create({
      ...teacherData,
      user: newUser,
    });

    return this.teacherRepo.save(teacher);
  }

  // GET ALL
  async findAll(search?: string) {
    const where = search ? [
      { user: { fullName: Like(`%${search}%`) } },
      { designation: Like(`%${search}%`) }
    ] : {};

    return this.teacherRepo.find({
      where,
      relations: ['user', 'subjects' ,'assignments'],
    });
  }

  // GET ONE
  async findOne(id: number) {
    const teacher = await this.teacherRepo.findOne({
      where: { id },
      relations: ['user', 'subjects', 'assignments'],
    });

    if (!teacher) {
      throw new NotFoundException(
        'Teacher not found',
      );
    }

    return teacher;
  }

  // UPDATE
  async update(
    id: number,
    dto: UpdateTeacherDto,
  ) {
    const teacher = await this.findOne(id);

    if (dto.fullName) {
      teacher.user.fullName = dto.fullName;
      await this.userRepo.save(teacher.user);
    }

    teacher.designation =
      dto.designation ?? teacher.designation;

    teacher.phone =
      dto.phone ?? teacher.phone;

    teacher.address =
      dto.address ?? teacher.address;

    await this.teacherRepo.save(teacher);

    return this.findOne(id);
  }

  // DELETE
  async remove(id: number) {
    const teacher = await this.findOne(id);

    await this.teacherRepo.remove(teacher);

    return {
      message: 'Teacher deleted successfully',
    };
  }
}