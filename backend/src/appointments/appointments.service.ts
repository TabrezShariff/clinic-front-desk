import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  findAll(date?: string): Promise<Appointment[]> {
    if (date) {
      const qb = this.appointmentRepo
        .createQueryBuilder('a')
        .leftJoinAndSelect('a.patient', 'patient')
        .leftJoinAndSelect('a.doctor', 'doctor')
        .where('a.timeslot LIKE :d', { d: `${date}%` })
        .orderBy('a.timeslot', 'ASC');
      return qb.getMany();
    }
    return this.appointmentRepo.find({ relations: ['patient', 'doctor'], order: { timeslot: 'ASC' } });
  }

  create(data: Partial<Appointment>): Promise<Appointment> {
    const appt = this.appointmentRepo.create(data);
    return this.appointmentRepo.save(appt);
  }

  async update(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const existing = await this.appointmentRepo.findOne({ where: { id } });
    if (!existing) {
      throw new Error('Appointment not found');
    }
    Object.assign(existing, data);
    return this.appointmentRepo.save(existing);
  }
}
