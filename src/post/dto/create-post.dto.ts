import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly content: string;
  @ApiPropertyOptional({ format: 'binary', type: 'string' })
  readonly postUrl: string;
}
