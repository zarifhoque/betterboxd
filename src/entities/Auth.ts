import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  authId!: number;

  @OneToOne(() => User)
  @JoinColumn({name:'userId'}) // foreign key
  user!: User;

  @Column({ type: 'varchar', length: 255 })
  hashedPassword!: string; // hashed
}
