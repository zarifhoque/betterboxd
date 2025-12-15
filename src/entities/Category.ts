// src/entities/Category.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Story } from './Story';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @ManyToMany(() => Story, (story) => story.categoriesByCategoryId)
  storiesByStoryId!: Story[];
}
