import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty()
  readonly body: string;
  @ApiProperty()
  readonly postId: number;
}
