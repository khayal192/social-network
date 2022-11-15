import { ApiProperty } from '@nestjs/swagger';

export class LikeDto {
  @ApiProperty()
  readonly postId: number;
}
