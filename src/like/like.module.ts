import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from '../entities/like.entity';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, PostEntity, UserEntity])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
