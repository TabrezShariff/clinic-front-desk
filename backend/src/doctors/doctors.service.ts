import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find();
  }

  create(doctor: Partial<Doctor>): Promise<Doctor> {
    const newDoctor = this.doctorsRepository.create(doctor);
    return this.doctorsRepository.save(newDoctor);
  }

  async update(id: number, doctor: Partial<Doctor>): Promise<Doctor> {
    const existing = await this.doctorsRepository.findOne({ where: { id } });
    if (!existing) throw new Error('Doctor not found');
    Object.assign(existing, doctor);
    return this.doctorsRepository.save(existing);
  }

  async remove(id: number): Promise<void> {
    await this.doctorsRepository.delete(id);
  }

  async search(params: {
    q?: string;
    specialization?: string;
    location?: string;
    availability?: string;
  }): Promise<Doctor[]> {
    const qb = this.doctorsRepository.createQueryBuilder('d');
    if (params.q) {
      qb.andWhere('d.name LIKE :q OR d.specialization LIKE :q OR d.location LIKE :q', {
        q: `%${params.q}%`,
      });
    }
    if (params.specialization) qb.andWhere('d.specialization = :s', { s: params.specialization });
    if (params.location) qb.andWhere('d.location = :l', { l: params.location });
    if (params.availability) qb.andWhere('d.availability = :a', { a: params.availability });
    return qb.getMany();
  }
}
