import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareEntity } from '../entities/share.entity';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ShareEntity)
    private readonly shareRepository: Repository<ShareEntity>,
  ) {}

  async shared(dto: CreateShareDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const sentUser = await this.userRepository.findOne({
      where: { id: dto.shareUserId },
    });

    if (!sentUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const share = new ShareEntity();
    share.user = user;
    share.sendUser = sentUser;

    return await this.shareRepository.save(share);
  }

  async deleteShared(shareId: number, userId: number): Promise<void> {
    const deleteShare = await this.shareRepository.findOne({
      where: { id: shareId },
      relations: ['user'],
    });

    if (!deleteShare) {
      throw new NotFoundException(`POST NOT FOUND`);
    }

    if (deleteShare.user.id === userId) {
      await this.shareRepository.remove(deleteShare);
      return;
    }

    throw new BadRequestException(`USER IS NOT CREATOR POST`);
  }
}
