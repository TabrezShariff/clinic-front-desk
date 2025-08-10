// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enable CORS for local development
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  });

  // Auto-ensure admin user exists (runs on every startup)
  try {
    const usersService = app.get(UsersService);
    await usersService.ensureAdminExists();
  } catch (err) {
    console.error('Failed to ensure admin user:', err);
  }

  // Listen on localhost for local development
  await app.listen(PORT);
  console.log(`🚀 Backend listening on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Admin credentials: admin@clinic.com / admin123`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
