import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes PrismaService available to all modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export so other modules can use it
})
export class PrismaModule {}
