import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueueModule } from './queue/queue.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseInitService } from './database-init.service';
import { HealthController } from './health.controller';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Your_db_password',
      database: 'clinic_system',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DoctorsModule,
    PatientsModule,
    AppointmentsModule,
    QueueModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [DatabaseInitService],
})
export class AppModule {}
