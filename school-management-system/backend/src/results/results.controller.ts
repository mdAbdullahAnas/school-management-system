import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Req } from '@nestjs/common';
import { ResultsService } from './results.service';

import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../users/entities/user.entity';

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Controller('results')
export class ResultsController {
  constructor(
    private readonly resultsService: ResultsService,
  ) {}

  // ADMIN + TEACHER
 @Post()
@Roles(Role.ADMIN, Role.TEACHER)
create(
  @Body()
  createResultDto: CreateResultDto,
  @Req() req: any,
) {
  return this.resultsService.create(
    createResultDto,
    req.user,
  );
}

  // ADMIN + TEACHER
  @Roles(Role.ADMIN, Role.TEACHER)
  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  // STUDENT CAN VIEW
  @Roles(
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
  }

  // ADMIN + TEACHER
  @Roles(Role.ADMIN, Role.TEACHER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateResultDto: UpdateResultDto,
  ) {
    return this.resultsService.update(
      +id,
      updateResultDto,
    );
  }

  // ONLY ADMIN
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultsService.remove(+id);
  }

  // STUDENT RESULTS
  @Roles(
    Role.ADMIN,
    Role.TEACHER,
    Role.STUDENT,
  )
  @Get('student/:id')
  getStudentResults(
    @Param('id') id: string,
  ) {
    return this.resultsService.getStudentResults(
      +id,
    );
  }
}