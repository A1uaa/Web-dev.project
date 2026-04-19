// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private dbService: DbService) {}

  getPosts(): Post[] {
    return this.dbService.getPosts();
  }

  getPost(id: number): Post | undefined {
    return this.dbService.getPost(id);
  }

  createPost(post: Partial<Post>): Post {
    return this.dbService.createPost(post);
  }

  likePost(id: number): void {
    this.dbService.likePost(id);
  }
  
  // ✅ Добавьте метод unlikePost
  unlikePost(id: number): void {
    this.dbService.unlikePost(id);
  }

  getPostsByUser(userId: number): Post[] {
    return this.dbService.getPosts().filter(p => p.authorId === userId);
  }
}