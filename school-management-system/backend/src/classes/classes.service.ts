import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepo: Repository<Class>,
  ) {}

  async create(dto: CreateClassDto) {
    const classroom = this.classRepo.create({
      className: dto.name, // Matching DTO 'name' to entity 'className'
      section: dto.section,
    });
    return this.classRepo.save(classroom);
  }

  async findAll() {
    return this.classRepo.find({
      relations: ['students', 'students.user'],
    });
  }

  async findOne(id: number) {
    const classroom = await this.classRepo.findOne({
      where: { id },
      relations: ['students', 'students.user'],
    });
    if (!classroom) throw new NotFoundException('Class not found');
    return classroom;
  }

  async update(id: number, dto: UpdateClassDto) {
    const classroom = await this.findOne(id);
    classroom.className = dto.name ?? classroom.className;
    classroom.section = dto.section ?? classroom.section;
    return this.classRepo.save(classroom);
  }

  async remove(id: number) {
    const classroom = await this.findOne(id);
    await this.classRepo.remove(classroom);
    return { message: 'Class deleted successfully' };
  }
}
