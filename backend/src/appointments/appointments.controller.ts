import { Controller, Get, Post, Body, UseGuards, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(@Query('date') date?: string): Promise<Appointment[]> {
    return this.appointmentsService.findAll(date);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: Partial<Appointment>): Promise<Appointment> {
    return this.appointmentsService.create(data);
  }

  // Update timeslot/status/doctor/patient (reschedule, cancel, complete)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Appointment>): Promise<Appointment> {
    return this.appointmentsService.update(Number(id), data);
  }

  // Cancel appointment (soft by setting status)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  cancel(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.update(Number(id), { status: 'cancelled' });
  }
}
