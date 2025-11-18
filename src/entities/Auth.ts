import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Auth {

  @PrimaryGeneratedColumn()
  authId!: number;

  @Column({ unique: true, type: 'varchar', length: 50 })
  username!: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  hashedPassword!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  userByUsername !: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  userByEmail!: User;


}
