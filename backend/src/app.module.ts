import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueueModule } from './queue/queue.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseInitService } from './database-init.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',           // change if your MySQL username is different
      password: 'T@brez_8447',  // put your MySQL password
      database: 'clinic_system',  // DB we created in Step 0
      autoLoadEntities: true,     // Automatically load entities
      synchronize: true,          // Auto create tables (only for dev)
    }),
    DoctorsModule,
    PatientsModule,
    AppointmentsModule,
    QueueModule,
    UsersModule,
    AuthModule,
  ],
  providers: [DatabaseInitService],
})
export class AppModule {}
