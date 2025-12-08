import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  storyId!: string;

  @Column({ type: 'uuid' })
  @Expose()
  userId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  @Exclude()
  userByUserId!: User;

  @Column({ type: 'varchar', length: 255 })
  @Expose()
  title!: string;

  @Column({ type: 'text' })
  @Expose()
  body!: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  aiSummary?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt!: Date | null;
}
