import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('setup-info')
  async getSetupInfo() {
    const userCount = await this.usersService.countUsers();
    const adminExists = await this.usersService.findByEmail('admin@clinic.com');
    
    return {
      hasUsers: userCount > 0,
      adminExists: !!adminExists,
      defaultCredentials: {
        email: 'admin@clinic.com',
        password: 'admin123',
        note: 'This user will be automatically created if no users exist'
      }
    };
  }
}
