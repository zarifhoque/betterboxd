// utils/mailer.ts
import nodemailer from 'nodemailer';
import { ENV } from '../config/Env';
import { logger } from '../config/Logger';

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: ENV.SMTP_SECURE,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendConfirmationEmail = async (to: string, token: string) => {
  try {
    const url = `${ENV.FRONTEND_URL}/api/auth/confirm-email/${token}`;
    await transporter.sendMail({
      from: '"BetterBoxd" <no-reply@betterboxd.com>',
      to,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${url}">here</a> to confirm your email.</p>`,
    });
    return true;
  } catch (err: unknown) {
    logger.error('sendConfirmationEmail failed', err);
    return false;
  }
};
