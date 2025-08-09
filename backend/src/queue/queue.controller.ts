import { Controller, Get, Post, Body, UseGuards, Patch, Param, Query, Delete } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueEntry } from './queue.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(@Query('status') status?: string): Promise<QueueEntry[]> {
    return this.queueService.findAll(status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: Partial<QueueEntry>): Promise<QueueEntry> {
    return this.queueService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.queueService.update(Number(id), { status });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/priority')
  updatePriority(@Param('id') id: string, @Body('priority') priority: number) {
    return this.queueService.update(Number(id), { priority });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(Number(id));
  }
}
