import { AppDataSource } from '../database/DataSource';
import { Auth } from '../entities/Auth';

export class AuthRepository {
  private authRepository = AppDataSource.getRepository(Auth);

  async getByUsername(username: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { username } });
  }

  async getByEmail(email: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { email } });
  }

  async createAuth(authData: Partial<Auth>): Promise<Auth> {
    const auth = this.authRepository.create(authData);
    return this.authRepository.save(auth);
  }

  async updatePassword(authId: string, hashedPassword: string): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      hashedPassword,
      passwordLastModificationTime: new Date(),
    });
    return (result.affected ?? 0) > 0;
  }
}
