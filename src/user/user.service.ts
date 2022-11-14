import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllUsers() {
    return await this.userRepository.find();
  }

  async findByEmail(email: string) {
    const findByEmail = await this.userRepository.findOne({ where: { email } });
    if (!findByEmail) {
      throw new HttpException(
        'This user not found ${email}',
        HttpStatus.NOT_FOUND,
      );
    }
    return findByEmail;
  }

  async findById(userId: number) {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!findUser) {
      throw new HttpException(
        'This user not found ${id}',
        HttpStatus.NOT_FOUND,
      );
    }
    return findUser;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.id === userId) {
      await this.userRepository.remove(user);
      return;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }
    user.username = updateUserDto.username;
    user.email = updateUserDto.email;
    user.password = await bcrypt.hash(updateUserDto.password, 10);

    return await this.userRepository.save(user);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { currentHashedRefreshToken });
  }

  async removeRefreshToken(userId: number) {
    const user = await this.findById(userId);
    user.currentHashedRefreshToken = null;
    await this.userRepository.save(user);
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }
}
