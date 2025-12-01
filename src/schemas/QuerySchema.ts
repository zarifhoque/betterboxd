import { PaginationSchemaType } from './PaginationSchema';
import { StorySearchQuerySchemaType, UserSearchQuerySchemaType } from './SearchSchema';

export type UserQueryType = PaginationSchemaType & UserSearchQuerySchemaType;
export type StoryQueryType = PaginationSchemaType & StorySearchQuerySchemaType;
