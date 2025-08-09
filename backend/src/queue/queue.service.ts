import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntry } from './queue.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntry)
    private queueRepo: Repository<QueueEntry>,
  ) {}

  findAll(status?: string): Promise<QueueEntry[]> {
    const where = status ? { status } : {};
    return this.queueRepo.find({ where, relations: ['patient'], order: { priority: 'DESC', createdAt: 'ASC' } });
  }

  create(data: Partial<QueueEntry>): Promise<QueueEntry> {
    const entry = this.queueRepo.create(data);
    return this.assignQueueNumberIfMissing(entry).then((e) => this.queueRepo.save(e));
  }

  async update(id: number, data: Partial<QueueEntry>) {
    const existing = await this.queueRepo.findOne({ where: { id } });
    if (!existing) throw new Error('Queue entry not found');
    Object.assign(existing, data);
    return this.queueRepo.save(existing);
  }

  async remove(id: number) {
    await this.queueRepo.delete(id);
    return { success: true };
  }

  private async assignQueueNumberIfMissing(entry: QueueEntry): Promise<QueueEntry> {
    if (entry.queueNumber && entry.queueNumber > 0) return entry;
    const latest = await this.queueRepo
      .createQueryBuilder('q')
      .select('MAX(q.queueNumber)', 'max')
      .getRawOne<{ max: number }>();
    const next = (latest?.max ?? 0) + 1;
    entry.queueNumber = next;
    return entry;
  }
}
