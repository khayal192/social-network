import { ApiProperty } from '@nestjs/swagger';

export class CreateBannedDto {
  @ApiProperty()
  banUserId: number;
}
