import {z} from 'zod';
import { UserRole } from '../entities/User';

export const userCreateSchema = z.object({
    username: z.string().min(3, 'Name must be at least 3 characters long').max(50, 'Name must be at most 50 characters long'),
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters long'),
    email: z.email('Invalid email address').max(100, 'Email must be at most 100 characters long'),
    joinDate: z.date().optional(),
    role: z.enum(UserRole).optional(),
});
export const userUpdateSchema = z.object({
    username: z.string().min(3, 'Name must be at least 3 characters long').max(50, 'Name must be at most 50 characters long').optional(),
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters long').optional(),
    email: z.email('Invalid email address').max(100, 'Email must be at most 100 characters long').optional(),
    role: z.enum(UserRole).optional(),
});  

export type UserCreateSchemaType = z.infer<typeof userCreateSchema>;
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;