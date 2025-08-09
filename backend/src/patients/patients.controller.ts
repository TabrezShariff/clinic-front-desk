import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './patient.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: Partial<Patient>): Promise<Patient> {
    return this.patientsService.create(data);
  }
}
