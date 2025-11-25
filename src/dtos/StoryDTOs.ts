export interface StoryCreateDTO {
  title: string;
  body: string;
  userByUserId: string;
}

export interface StoryUpdateDTO {
  title?: string;
  body?: string;
}

export interface StoryResponseDTO {
  storyId: string;
  userId: string;
  title: string;
  body: string;
  updatedAt: Date;
}
