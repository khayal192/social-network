import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserService } from 'src/user/user.service';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import JwtRefreshGuard from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('registration')
  async registration(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registration(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Req() req) {
    const { user } = req;
    const accessTokenCokkie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );

    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );
    req.res.setHeader('Set-Cokkie', [
      accessTokenCokkie,
      refreshTokenCookie.cookie,
    ]);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@Req() request, @Res() response: Response) {
    await this.userService.removeRefreshToken(request.user.id);
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: Request) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user['id'],
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
