import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { UserEntity } from '../entities/user.entity';
import { PostEntity } from '../entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, PostEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
