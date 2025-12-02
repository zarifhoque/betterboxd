import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  userId!: string;
  @Expose()
  @Column({ unique: true, type: 'varchar', length: 50 })
  username!: string;
  @Expose()
  @Column({ type: 'varchar', length: 100 })
  name!: string;
  @Expose()
  @Column({ unique: true, type: 'varchar', length: 100 })
  email!: string;
  @Expose()
  @Column({ type: 'text' })
  @Expose()
  bio!: string;
  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  joinDate!: Date;
  @Expose()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;
  @Exclude()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date | null;
}
