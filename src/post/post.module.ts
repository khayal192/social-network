import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { PostEntity } from '../entities/post.entity';
import { CommentEntity } from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity, CommentEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
