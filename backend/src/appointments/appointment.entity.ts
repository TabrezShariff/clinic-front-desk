import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';
import { Patient } from '../patients/patient.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient)
  patient: Patient;

  @ManyToOne(() => Doctor)
  doctor: Doctor;

  @Column()
  timeslot: string; // ISO string for simplicity

  @Column({ default: 'booked' })
  status: string; // booked, rescheduled, cancelled, completed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
