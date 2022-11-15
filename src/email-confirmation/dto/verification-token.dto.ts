import { ApiProperty } from '@nestjs/swagger';

export class VerificationTokenPayload {
  @ApiProperty()
  email: string;
}
