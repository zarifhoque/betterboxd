import { Expose, Transform } from 'class-transformer';
import { Story } from '../entities/Story';

export interface StoryCreateDTO {
  title: string;
  body: string;
  // userByUserId: string; // no longer can be provided directly by the user
}

export interface StoryUpdateDTO {
  title?: string;
  body?: string;
}

export class StoryResponseDTO {
  @Expose()
  storyId!: string;
  @Expose()
  userId!: string;
  @Expose()
  title!: string;
  @Expose()
  body!: string;
  @Expose()
  updatedAt!: Date;
  @Expose()
  @Transform(({ obj }: { obj: Story }) => obj.userByUserId?.username ?? null)
  username!: string;
}
