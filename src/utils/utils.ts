import { User } from '../entities/User';
import { UserResponseDTO } from '../dtos/UserDTOs';
import { Story } from '../entities/Story';
import { StoryResponseDTO } from '../dtos/StoryDTOs';

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    userId: user.userId,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    joinDate: user.joinDate,
  };
}

export function toUserResponseDTOs(users: User[]): UserResponseDTO[] {
  return users.map(toUserResponseDTO);
}

export function toStoryResponseDTO(story: Story): StoryResponseDTO {
  return {
    storyId: story.storyId,
    title: story.title,
    body: story.body,
    userId: story.userId,
    updatedAt: story.updatedAt,
  };
}

export function toStoryResponseDTOs(stories: Story[]): StoryResponseDTO[] {
  return stories.map(toStoryResponseDTO);
}
