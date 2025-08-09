import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { QueueEntry } from './queue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueueEntry])],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
