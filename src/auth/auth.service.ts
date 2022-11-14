import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException('EMAIL_DO_NOT_CONFIRM');
    }
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...rest } = user;
        return rest;
      } else {
        throw new UnauthorizedException('AUTHORIZATION_ERROR');
      }
    }
    return null;
  }

  async registration(createUserDto: CreateUserDto) {
    const userDb = await this.findByEmail(createUserDto.email);
    if (userDb) {
      throw new HttpException(
        `${createUserDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const users = new UserEntity();
    users.email = createUserDto.email;
    users.username = createUserDto.username;
    users.password = await bcrypt.hash(createUserDto.password, 10);
    const saveUser = await this.userRepository.save(users);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = saveUser;
    await this.emailConfirmationService.sendVerificationLink(users.email);
    return userResponse;
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  public getCookieWithJwtAccessToken(userId: number) {
    const payload = { userId };
    const expiresIn = '10m';

    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload = { userId };
    const expiresIn = '10d';
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
    return {
      cookie,
      token,
    };
  }

  getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
