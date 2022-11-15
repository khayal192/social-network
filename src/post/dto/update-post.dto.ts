import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly content: string;
}
