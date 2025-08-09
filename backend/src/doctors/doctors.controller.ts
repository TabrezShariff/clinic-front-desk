import { Controller, Get, Post, Body, UseGuards, Query, Patch, Param, Delete } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { Doctor } from './doctor.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllDoctors(
    @Query('q') q?: string,
    @Query('specialization') specialization?: string,
    @Query('location') location?: string,
    @Query('availability') availability?: string,
  ): Promise<Doctor[]> {
    return this.doctorsService.search({ q, specialization, location, availability });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addDoctor(@Body() doctorData: Partial<Doctor>): Promise<Doctor> {
    return this.doctorsService.create(doctorData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateDoctor(@Param('id') id: string, @Body() doctorData: Partial<Doctor>): Promise<Doctor> {
    return this.doctorsService.update(Number(id), doctorData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  removeDoctor(@Param('id') id: string): Promise<void> {
    return this.doctorsService.remove(Number(id));
  }
}
