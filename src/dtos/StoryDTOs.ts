export interface StoryCreateDTO {
  title: string;
  body: string;
  // userByUserId: string; // no longer can be provided directly by the user
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
