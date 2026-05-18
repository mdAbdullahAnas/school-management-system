import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../users/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // REGISTER
  async register(data: any) {
    const existing: User | null = await this.userRepo.findOneBy({
      email: data.email,
    });

    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role || Role.STUDENT,
    });

    await this.userRepo.save(user);

    return this.signToken(user);
  }

  // LOGIN
  async login(data: any) {
    const user: User | null = await this.userRepo.findOne({
      where: { email: data.email },
      relations: ['student', 'teacher'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  // SIGN TOKEN
  signToken(user: User) {
    const profileId = user.student?.id || user.teacher?.id || null;

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      profileId: profileId,
    };

    const { password, ...safeUser } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...safeUser,
        profileId: profileId,
      },
    };
  }

  // CHANGE PASSWORD
  async changePassword(userId: number, dto: any) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }
}
