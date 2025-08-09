import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from '../patients/patient.entity';

@Entity()
export class QueueEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient)
  patient: Patient;

  @Column()
  queueNumber: number;

  @Column({ default: 'waiting' })
  status: string; // waiting, with_doctor, completed

  @Column({ default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;
}
