import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
  ): Promise<void> {
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:3000';

    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const subject = 'Reset your WorkLancer AI Password';

    const html = this.buildResetEmailHtml(resetLink);

    const from = process.env.SMTP_FROM || 'WorkLancer AI <no-reply@worklancer.ai>';

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send password reset email to ${to}: ${error?.message || error}`,
      );
      throw error;
    }
  }

  private buildResetEmailHtml(resetLink: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your WorkLancer AI Password</title>
  </head>
  <body style="margin:0; padding:0; background-color:#020617; font-family:'Inter', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#020617; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:linear-gradient(135deg, #0f172a 0%, #111827 100%); border:1px solid rgba(255,255,255,0.08); border-radius:24px; overflow:hidden;">
            <tr>
              <td style="padding:40px 40px 24px; text-align:center;">
                <div style="display:inline-block; width:72px; height:72px; border-radius:20px; background:#ffffff; padding:6px; box-shadow:0 0 30px rgba(59,130,246,0.30);">
                  <div style="width:100%; height:100%; border-radius:16px; background:linear-gradient(135deg,#3b82f6,#8b5cf6); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:20px;">WL</div>
                </div>
                <h1 style="margin:24px 0 0; font-size:28px; font-weight:800; color:#ffffff; letter-spacing:-0.02em;">
                  WorkLancer <span style="background:linear-gradient(90deg,#22d3ee,#3b82f6,#8b5cf6); -webkit-background-clip:text; background-clip:text; color:transparent;">AI</span>
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px;">
                <h2 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#f8fafc;">Reset your password</h2>
                <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#cbd5e1;">
                  We received a request to reset your WorkLancer AI password. Click the button below to choose a new password. This link will expire in <strong style="color:#e2e8f0;">15 minutes</strong> and can only be used once.
                </p>
                <p style="margin:0 0 28px; text-align:center;">
                  <a href="${resetLink}" target="_blank" style="display:inline-block; padding:14px 36px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:14px; background:linear-gradient(90deg,#2563eb,#7c3aed); box-shadow:0 8px 24px rgba(59,130,246,0.35);">
                    Reset Password
                  </a>
                </p>
                <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:#94a3b8;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 8px; word-break:break-all; font-size:13px; line-height:1.5; color:#60a5fa;">
                  ${resetLink}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 40px; border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0; font-size:13px; line-height:1.6; color:#64748b;">
                  If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
                </p>
                <p style="margin:16px 0 0; font-size:13px; color:#475569;">
                  &copy; ${new Date().getFullYear()} WorkLancer AI. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim();
  }
}
