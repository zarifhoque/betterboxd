import { AppDataSource } from "../database/DataSource";
import { User } from "../entities/User";

export class UserRepository {
    private userRepository = AppDataSource.getRepository(User);

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({ relations: ['auth'] });
    }

    async getUserById(userId: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { userId }, relations: ['auth'] });
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async updateUser(userId: number, userData: Partial<User>): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            return null;
        }
        this.userRepository.merge(user, userData);
        return this.userRepository.save(user);
    }

    async softDeleteUser(id: number): Promise<boolean> {
        const result = await this.userRepository.softDelete(id);
        return result.affected !== undefined && result.affected > 0;
    }

    async hardDeleteUser(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return (result.affected ?? 0) > 0; // nullish coalescing operator to handle undefined  
    }   
}