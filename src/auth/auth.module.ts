import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { EmailConfirmationController } from '../email-confirmation/email-confirmation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    UserModule,
    PassportModule,
    MailModule,
  ],

  controllers: [AuthController, EmailConfirmationController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    EmailConfirmationService,
  ],
})
export class AuthModule {}
