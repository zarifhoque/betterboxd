import { AuthRepository } from '../repositories/AuthRepository';
import { Auth } from '../entities/Auth';
import { instanceToPlain } from 'class-transformer';
import { z } from 'zod';
import { createError } from '../errors/ErrorFactory';

export class AuthService {
  private authRepository = new AuthRepository();

  // Get auth record by username
  async getByUsername(username: string): Promise<Auth> {
    const auth = await this.authRepository.getByUsername(username);
    if (!auth) {
      throw createError('NotFound', `Auth record for username "${username}" not found`);
    }
    return auth;
  }

  // Get auth record by email
  async getByEmail(email: string): Promise<Auth> {
    const auth = await this.authRepository.getByEmail(email);
    if (!auth) {
      throw createError('NotFound', `Auth record for email "${email}" not found`);
    }
    return auth;
  }

  // Create a new auth record
  async createAuth(authData: Partial<Auth>): Promise<Auth> {
    const newAuth = await this.authRepository.createAuth(authData);
    return instanceToPlain(newAuth) as Auth;
  }

  // async signin()

  // Update password by auth ID
  async updatePassword(authId: string, hashedPassword: string): Promise<void> {
    // TODO: will be implemented
  }
}
