import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from '../entities/like.entity';
import { UserEntity } from '../entities/user.entity';
import { PostEntity } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async likePost(userId: number, likeDto: LikeDto) {
    const likeExist = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: likeDto.postId } },
    });

    if (likeExist) {
      await this.likeRepository.remove(likeExist);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('not user found', HttpStatus.NOT_FOUND);
    }

    const post = await this.postRepository.findOne({
      where: { id: likeDto.postId },
    });
    if (!post) {
      throw new HttpException('not post found', HttpStatus.NOT_FOUND);
    }

    const like = new LikeEntity();
    like.user = user;
    like.post = post;

    await this.likeRepository.save(like);
  }
}
