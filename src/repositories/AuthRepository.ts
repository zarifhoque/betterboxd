import { injectable } from 'tsyringe';
import { Auth } from '../entities/Auth';
import { AppDataSource } from '../database/DataSource';

@injectable()
export class AuthRepository {
  private authRepository = AppDataSource.getRepository(Auth);

  async getByEmail(email: string): Promise<Auth | null> {
    return this.authRepository
      .createQueryBuilder('auth')
      .leftJoinAndSelect('auth.userByUserId', 'user')
      .where('auth.email = :email', { email })
      .getOne();
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
