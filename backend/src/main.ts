import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Security headers
  app.use(helmet());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  const allowedOrigins = NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.vercel.app']
    : ['http://localhost:3001', 'http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global prefix for API routes
  app.setGlobalPrefix('api/v1');

  // Auto-ensure admin user exists
  try {
    const usersService = app.get(UsersService);
    await usersService.ensureAdminExists();
  } catch (err) {
    console.error('Failed to ensure admin user:', err);
  }

  // Listen on all interfaces for Railway
  await app.listen(PORT, '0.0.0.0');
  
  console.log(`🚀 Backend listening on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔐 Admin credentials: admin@clinic.com / admin123`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
