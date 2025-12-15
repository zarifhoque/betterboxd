import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  authId!: string;

  @Column({ type: 'varchar', length: 255 })
  hashedPassword!: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordLastModificationTime!: Date;

  @Column({ type: 'varchar', length: 50 })
  username!: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  userByUserId!: User;

  @Column({ type: 'text', nullable: true })
  emailConfirmationToken!: string;

  @Column({ type: 'varchar', nullable: true })
  passwordChangeToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangeExpires!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  pendingPasswordHash!: string | null;
}
