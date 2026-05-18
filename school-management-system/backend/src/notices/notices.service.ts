import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepo: Repository<Notice>,
  ) {}

  async create(dto: CreateNoticeDto) {
    const notice = this.noticeRepo.create({
      title: dto.title,
      message: dto.content, // Matching the DTO 'content' to entity 'message'
      publishedAt: new Date(),
    });
    return this.noticeRepo.save(notice);
  }

  async findAll() {
    return this.noticeRepo.find({
      order: { publishedAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const notice = await this.noticeRepo.findOneBy({ id });
    if (!notice) throw new NotFoundException('Notice not found');
    return notice;
  }

  async update(id: number, dto: UpdateNoticeDto) {
    const notice = await this.findOne(id);
    notice.title = dto.title ?? notice.title;
    notice.message = dto.content ?? notice.message;
    return this.noticeRepo.save(notice);
  }

  async remove(id: number) {
    const notice = await this.findOne(id);
    await this.noticeRepo.remove(notice);
    return { message: 'Notice deleted successfully' };
  }
}
