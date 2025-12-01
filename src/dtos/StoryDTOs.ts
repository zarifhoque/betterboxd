export interface StoryCreateDTO {
  title: string;
  body: string;
  userByUserId: string;
}

export interface StoryUpdateDTO {
  title?: string;
  body?: string;
}

export type StoryResponse = {
  storyId: string;
  userId: string;
  title: string;
  body: string;
  updatedAt: Date;
};
