import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";
import {
  DEFAULT_MAIL_FROM,
  DEFAULT_SMTP_HOST,
  DEFAULT_SMTP_PORT,
} from "./models/notification.constants";

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get<string>("SMTP_HOST") ?? DEFAULT_SMTP_HOST,
      port: Number(configService.get<string>("SMTP_PORT") ?? DEFAULT_SMTP_PORT),
      secure: false,
    });
    this.from = configService.get<string>("MAIL_FROM") ?? DEFAULT_MAIL_FROM;
  }

  async send(to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({ from: this.from, to, subject, text });
  }
}
