import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async findAllPosts(userId: number) {
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findById(id: number) {
    const findPost = await this.postRepository.findOne({
      where: { id },
    });
    if (!findPost) {
      throw new HttpException(
        `This users not find ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return findPost;
  }

  async createPosts(createPostDto: CreatePostDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }
    const post = await this.postRepository.create(createPostDto);
    post.user = user;
    return this.postRepository.save(post);
  }

  async deletePosts(postId: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) {
      throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    }
    if (post.user.id === userId) {
      await this.postRepository.remove(post);
      return;
    }
  }
}
