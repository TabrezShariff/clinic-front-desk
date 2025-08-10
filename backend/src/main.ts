// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

  // Enable CORS: allow only frontend origin in production, allow localhost in dev
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({ origin: FRONTEND_URL, credentials: true });
  } else {
    app.enableCors({
      origin: ['http://localhost:3001', 'http://localhost:3000'],
      credentials: true,
    });
  }

  // Optional: global prefix for API routes if you like (makes route URLs explicit)
  // app.setGlobalPrefix('api');

  // Optional one-time seeding: only run when SEED_ADMIN=true in env
  if (process.env.SEED_ADMIN === 'true') {
    try {
      const usersService = app.get(UsersService);
      const email = process.env.SEED_EMAIL || 'admin@clinic.com';
      const existing = await usersService.findByEmail(email);
      if (!existing) {
        await usersService.createUser(
          process.env.SEED_NAME || 'Admin',
          email,
          process.env.SEED_PASSWORD || 'admin123',
          'admin',
        );
        console.log('Seeded admin user:', email);
      } else {
        console.log('Seed admin skipped, user exists:', email);
      }
    } catch (err) {
      console.error('Seed admin failed:', err);
    }
  }

  // Listen on 0.0.0.0 so Render can bind properly
  await app.listen(PORT, '0.0.0.0');
  console.log(`Backend listening on port ${PORT}`);
}

bootstrap();
