import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../users/entities/user.entity';

@Controller('students')
@UseGuards(JwtAuthGuard) // 🔐 ALL ROUTES PROTECTED
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // 🟢 CREATE STUDENT (ADMIN ONLY)
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  // 🟡 GET ALL STUDENTS (ADMIN + TEACHER)
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  findAll(@Query('search') search?: string) {
    return this.studentsService.findAll(search);
  }
  // 🔵 GET SINGLE STUDENT
 @Get(':id')
findOne(@Param('id') id: string) {
  const studentId = Number(id);

  if (isNaN(studentId)) {
    throw new Error('Invalid student ID');
  }

  return this.studentsService.findOne(studentId);
}

  // 🟠 UPDATE STUDENT (ADMIN ONLY)
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(+id, dto);
  }

  // 🔴 DELETE STUDENT (ADMIN ONLY)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }

  // 👤 LOGIN USER PROFILE (JWT TEST)
  @Get('profile')
  getProfile() {
    return 'Logged in user only';
  }
}