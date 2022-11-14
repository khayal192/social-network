import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';
import { EmailConfirmationService } from './email-confirmation.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email-confirm')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    return await this.emailConfirmationService.confirmEmail(email);
  }
}
