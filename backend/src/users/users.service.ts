import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async createUser(name: string, email: string, password: string, role = 'frontdesk') {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ name, email, password: hashed, role });
    return this.usersRepo.save(user);
  }

  async countUsers() {
    return this.usersRepo.count();
  }

  async ensureAdminExists() {
    try {
      const userCount = await this.countUsers();
      
      if (userCount === 0) {
        // No users exist, create the default admin user
        await this.createUser(
          'Admin',
          'admin@clinic.com',
          'admin123',
          'admin'
        );
        console.log('✅ Default admin user created: admin@clinic.com / admin123');
        return true;
      } else {
        // Check if admin user exists, if not create it
        const adminExists = await this.findByEmail('admin@clinic.com');
        if (!adminExists) {
          await this.createUser(
            'Admin',
            'admin@clinic.com',
            'admin123',
            'admin'
          );
          console.log('✅ Admin user created: admin@clinic.com / admin123');
          return true;
        }
        console.log('ℹ️ Admin user already exists');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to ensure admin user exists:', error);
      return false;
    }
  }
}
