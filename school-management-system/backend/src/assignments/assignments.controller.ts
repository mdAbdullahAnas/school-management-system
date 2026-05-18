import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AssignmentService } from './assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../users/entities/user.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentController {
  constructor(private service: AssignmentService) {}

  // CREATE (ADMIN + TEACHER)
  @Roles(Role.ADMIN, Role.TEACHER)
  @Post()
  create(@Body() dto: CreateAssignmentDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // STUDENT SUBMIT
  @Roles(Role.STUDENT)
  @Post('submit')
  submit(@Body() dto: any, @Req() req: any) {
    return this.service.submit(dto, req.user.id);
  }

  // SUBMISSIONS
  @Roles(Role.ADMIN, Role.TEACHER)
  @Get(':id/submissions')
  getSubmissions(@Param('id') id: number) {
    return this.service.getSubmissions(id);
  }

  // PENDING STUDENTS
  @Roles(Role.ADMIN, Role.TEACHER)
  @Get(':id/pending')
  getPending(@Param('id') id: number) {
    return this.service.getPendingStudents(id);
  }
}