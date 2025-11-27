import { Expose } from 'class-transformer';

export interface StoryCreateDTO {
  title: string;
  body: string;
  userByUserId: string;
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
}
