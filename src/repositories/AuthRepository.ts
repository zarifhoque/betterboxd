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

  async getByUserId(userId: string): Promise<Auth | null> {
    return this.authRepository
      .createQueryBuilder('auth')
      .leftJoinAndSelect('auth.userByUserId', 'user')
      .where('auth.userId = :userId', { userId })
      .getOne();
  }

  async createAuth(authData: Partial<Auth>): Promise<Auth> {
    const auth = this.authRepository.create(authData);
    return this.authRepository.save(auth);
  }

  async updateAuth(updatedAuth: Partial<Auth>): Promise<Auth> {
    await this.authRepository.update(updatedAuth.authId!, updatedAuth);
    return this.authRepository.findOneBy({ authId: updatedAuth.authId! }) as Promise<Auth>;
  }

  async findByPasswordChangeToken(token: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { passwordChangeToken: token } });
  }

  async updatePassword(authId: string, hashedPassword: string): Promise<boolean> {
    const result = await this.authRepository.update(authId, {
      hashedPassword,
      passwordLastModificationTime: new Date(),
    });
    return (result.affected ?? 0) > 0;
  }
}
