import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  async findById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.findById(id);
  }

  @Post('email')
  async findByEmail(email) {
    return this.userService.findByEmail(email);
  }

  @Delete(':id')
  async deleteUser(
    @CurrentUser() user,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return await this.userService.deleteUser(id);
  }

  @Put(':id')
  async updateUser(
    @CurrentUser() user,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(updateUserDto, id);
  }
}
