import { Injectable, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
      ) {}

      async register(dto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.prisma.user.findFirst({
          where: {
            OR: [{ email: dto.email }, { username: dto.username }],
          },
        });
    
        if (existingUser) {
          throw new UnauthorizedException('Email or username already exists');
        }
    
        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);
    
        // Create user
        const user = await this.prisma.user.create({
          data: {
            email: dto.email,
            username: dto.username,
            password: hashedPassword,
          },
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
          },
        });
    
        // Generate JWT token
        const token = this.jwtService.sign({ userId: user.id });
    
        return {
          user,
          token,
        };
      }

      async login(dto: LoginDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
          where: { email: dto.email },
        });
    
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        // Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        // Generate JWT token
        const token = this.jwtService.sign({ userId: user.id });
    
        return {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
          },
          token,
        };
      }

}
