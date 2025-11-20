import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ unique: true, type: 'varchar', length: 50 })
  username!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  email!: string;

  @CreateDateColumn({ type: 'timestamp' })
  joinDate!: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date | null;
}
