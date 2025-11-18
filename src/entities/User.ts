import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, DeleteDateColumn } from 'typeorm';
import { Auth } from './Auth';

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

  @Column({type: 'varchar', length: 100})
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

  @Column({ type: 'timestamp', nullable: true })
  passwordLastModificationTime!: Date;

  @OneToOne(() => Auth, (auth: Auth) => auth.user)
  auth!: Auth;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date | null;
}
