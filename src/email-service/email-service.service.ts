import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailServiceService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST as string,
      port: process.env.NODEMAILER_PORT as unknown as number, // Assuming port is a number
      secure: false, // Set true if your SMTP server requires a secure connection
      auth: {
        user: process.env.NODEMAILER_USER as string,
        pass: process.env.NODEMAILER_PASS as string,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    url: string,
  ): Promise<{ Success: boolean; message: string } | Error> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_EMAIL as string,
        to,
        subject,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table width="400" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); margin: 0 auto;padding:20px">
                          <tr>
                            <td style="margin: 10px auto">
                              <h1 style="font-size: 24px;text-align:center;"> Portal</h1>
                              <p style="text-align:center;"> Counselor/CCT</p>
                            </td>
                          </tr>
                            <tr>
                                <td style="text-align: center; padding: 20px 0;">
                                    <h1 style="font-size: 24px; font-weight: 800; color: #333333; margin-bottom: 10px;border-bottom:1px solid lightgray;">Reset Password</h1>
                                    <p style="font-size: 16px; margin-bottom: 20px;">You recently requested to reset your password for counselor portal Iskon Pune.</p>
                                    <p style="font-size: 16px; margin-bottom: 20px;">If not requested by you, please ignore this message.</p>
                                    <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: purple; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                                    <p style="font-size: 12px; color: rgb(168, 162, 158); margin-top: 20px;">The reset link expires within 24 hours.</p>
                                    <p style="font-size: 12px; color: rgb(248 113 113); margin-top: 20px;"> Do not share the link with anybody.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center; padding: 20px 0;">
                                    <p style="font-size: 10px; color: #666666;">ISKCON TEMPLE AND NVCC, Katraj - Kondhwa Rd, Tilekar Nagar, Kondhwa Budruk, Pune, Maharashtra 411048</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        
        `,
      });
      return { Success: true, message: `email sent ${to}` };
    } catch (error) {
      throw error;
    }
  }
}
