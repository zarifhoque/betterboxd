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

  // @OneToOne(() => User)
  // @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  // userByUsername!: User;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  // @OneToOne(() => User)
  // @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  // userByEmail!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  userByUserId!: User;
}
