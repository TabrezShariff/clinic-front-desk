import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepo: Repository<Patient>,
  ) {}

  findAll(): Promise<Patient[]> {
    return this.patientsRepo.find();
  }

  create(data: Partial<Patient>): Promise<Patient> {
    const patient = this.patientsRepo.create(data);
    return this.patientsRepo.save(patient);
  }
}
