// src/app/features/posts/post-card/post-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() like = new EventEmitter<{ id: number, isLiked: boolean }>();
  @Output() comment = new EventEmitter<number>();
  
  isLiked = false;

  onLikeClick(): void {
    this.isLiked = !this.isLiked;
    this.like.emit({ 
      id: this.post.id, 
      isLiked: this.isLiked 
    });
  }

  openComments(): void {
    this.comment.emit(this.post.id);
  }
}