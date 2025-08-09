import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseInitService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    // Only run for MySQL
    const driver = this.dataSource.options.type;
    if (driver !== 'mysql') return;

    const entities = this.dataSource.entityMetadatas;
    for (const meta of entities) {
      const table = meta.tableName;
      const primary = meta.primaryColumns[0];
      if (!primary) continue;
      // Ensure primary is numeric and generated
      if (!primary.isGenerated) continue;

      // Compute next auto increment as MAX(id)+1 or 1
      const [{ max } = { max: 0 }] = (await this.dataSource.query(
        `SELECT COALESCE(MAX(\`${primary.databaseName}\`), 0) as max FROM \`${table}\``,
      )) as Array<{ max: number }>;
      const next = Number(max) + 1;

      // Set AUTO_INCREMENT if lower than desired
      await this.dataSource.query(
        `ALTER TABLE \`${table}\` AUTO_INCREMENT = ${next > 0 ? next : 1}`,
      );
    }
  }
}
