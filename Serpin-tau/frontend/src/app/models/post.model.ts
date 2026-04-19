// src/app/models/post.model.ts
export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  comments: number;
}