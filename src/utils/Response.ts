import { Response } from 'express';

export const handleResponse = <T>(
  res: Response,
  data: T | null = null,
  options?: { status?: number; message?: string },
) => {
  const status = options?.status ?? 200;
  const message = options?.message ?? '';
  res.status(status).json({
    success: status >= 200 && status < 300,
    data,
    message,
  });
};
