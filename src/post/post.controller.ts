import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CurrentUser } from '../auth/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllPosts(@CurrentUser() user) {
    return await this.postService.findAllPosts(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @CurrentUser() user,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.postService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPosts(@CurrentUser() user, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPosts(createPostDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePosts(
    @CurrentUser() user,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.postService.deletePosts(id, user.userId);
  }
}
