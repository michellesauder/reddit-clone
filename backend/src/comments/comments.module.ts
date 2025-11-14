import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CommentsService, JwtService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
