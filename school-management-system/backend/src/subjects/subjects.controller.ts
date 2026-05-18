import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  findAll(
    @Query('teacherId') teacherId?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.subjectsService.findAll(
      teacherId ? +teacherId : undefined,
      studentId ? +studentId : undefined,
    );
  }

  @Post(':id/enroll')
  enroll(@Param('id') id: string, @Body('studentId') studentId: number) {
    return this.subjectsService.enroll(+id, studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }

  @Patch(':id/add-students')
addStudents(
  @Param('id') id: number,
  @Body() dto: { studentIds: number[] },
) {
  return this.subjectsService.addStudents(id, dto.studentIds);
}
}
