import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ResultsModule } from './results/results.module';
import { NoticesModule } from './notices/notices.module';
import { MailModule } from './mail/mail.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [
    // ENV Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // PostgreSQL Connection
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('DB_HOST'),

        port: Number(config.get<string>('DB_PORT')),

        username: config.get<string>('DB_USERNAME'),

        password: config.get<string>('DB_PASSWORD'),

        database: config.get<string>('DB_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    // Modules
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    SubjectsModule,
    AttendanceModule,
    AssignmentsModule,
    ResultsModule,
    NoticesModule,
    MailModule,
    ClassesModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}