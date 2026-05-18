import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AttendanceService } from './attendance.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorators';

import { Role } from '../users/entities/user.entity';

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  // ADMIN + TEACHER
  @Roles(
    Role.ADMIN,
    Role.TEACHER,
  )
  @Post()
  create(
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.attendanceService.create(
      body,
      req.user,
    );
  }

  // STUDENT VIEW
  @Roles(
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  )
  @Get('student/:id')
  getStudentAttendance(
    @Param('id') id: string,
  ) {
    return this.attendanceService.getStudentAttendance(
      +id,
    );
  }
}