import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BannedListEntity } from '../entities/banned.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBannedDto } from './dto/create-banned.dto';

@Injectable()
export class BannedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BannedListEntity)
    private readonly bannedListRepository: Repository<BannedListEntity>,
  ) {}

  async bannedUser(createBanDto: CreateBannedDto, userId: number) {
    const banned = await this.bannedListRepository.findOne({
      where: {
        user: { id: userId },
        bannedUser: { id: createBanDto.banUserId },
      },
    });
    if (banned) {
      throw new HttpException('user blocked', HttpStatus.BAD_REQUEST);
    }
    const userExist = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userExist) {
      throw new HttpException('user blocked', HttpStatus.BAD_REQUEST);
    }

    const bannedUser = await this.userRepository.findOne({
      where: { id: createBanDto.banUserId },
    });
    if (!bannedUser) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const banUser = new BannedListEntity();
    banUser.user = userExist;
    banUser.bannedUser = bannedUser;

    return await this.bannedListRepository.save(banUser);
  }

  async deleteBanned(bannedId: number, userId: number): Promise<void> {
    const deleteBanned = await this.bannedListRepository.findOne({
      where: { id: bannedId },
      relations: ['user'],
    });
    if (!deleteBanned) {
      throw new NotFoundException(`USER NOT FOUND`);
    }

    if (deleteBanned.user.id === userId) {
      await this.bannedListRepository.remove(deleteBanned);
      return;
    }

    throw new BadRequestException(`USER IS NOT CREATOR POST`);
  }
}
