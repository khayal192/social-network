import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllComment(@CurrentUser() user) {
    return this.commentService.findAll(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @CurrentUser() user,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(createCommentDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(
    @CurrentUser() user,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.commentService.deleteComment(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateComment(
    @CurrentUser() user,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(updateCommentDto, user.userId, id);
  }
}
