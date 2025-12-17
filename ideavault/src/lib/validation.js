import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const ideaSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  category: z.string().min(3, { message: 'Category must be at least 3 characters long' }),
  tags: z.array(z.string()).optional(),
});

export const commentSchema = z.object({
  text: z.string().min(1, { message: 'Comment text cannot be empty' }),
  ideaId: z.string().min(1, { message: 'Idea ID cannot be empty' }),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  passwordHash: z.string().optional(),
  role: z.string().optional(),
  badges: z.array(z.string()).optional(),
  id: z.string(),
});

export const updateIdeaVoteSchema = z.object({
  id: z.string(),
  change: z.enum(['plus', 'minus']),
});

export const idSchema = z.string().length(24, { message: 'ID must be a 24-character hexadecimal string' });