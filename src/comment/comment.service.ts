import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';
import { PostEntity } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async findAll(userId: number) {
    return await this.commentRepository.find({
      where: { user: { id: userId } },
      relations: ['post'],
    });
  }

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }

    const post = await this.postRepository.findOne({
      where: { id: createCommentDto.postId },
    });
    if (!post) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }

    const comment = new CommentEntity();
    comment.user = user;
    comment.post = post;
    comment.body = createCommentDto.body;
    const newComment = await this.commentRepository.save(comment);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: commentUser, post: commentPost, ...response } = newComment;
    return response;
  }

  async updateComment(
    updateCommentDto: UpdateCommentDto,
    userId: number,
    commentId: number,
  ): Promise<any> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, user: { id: userId } },
    });
    if (!comment) {
      throw new HttpException('COMMENT NOT FOUND', HttpStatus.NOT_FOUND);
    }
    comment.body = updateCommentDto.body;
    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new HttpException('COMMENT NOT FOUND', HttpStatus.NOT_FOUND);
    }
    if (comment.user.id === userId) {
      await this.commentRepository.remove(comment);
      return;
    }
    throw new HttpException(
      'User comment are not available',
      HttpStatus.NOT_FOUND,
    );
  }
}
