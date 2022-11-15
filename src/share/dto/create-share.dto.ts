import { ApiProperty } from '@nestjs/swagger';

export class CreateShareDto {
  @ApiProperty()
  readonly shareUserId: number;
}
