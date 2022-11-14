import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, url: string) {
    const response = `example.com/auth/confirm?token=${url}`;

    console.log({ url });
    await this.mailerService.sendMail({
      to: email,

      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        url,
      },
    });
  }
}
