// src/app/features/posts/post-detail/post-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { Post } from '../../../models/post.model';

interface Comment {
  id: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
}

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  newComment = '';
  comments: Comment[] = [];
  isPostLiked = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public postService: PostService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.post = this.postService.getPost(id);
    if (!this.post) {
      this.router.navigate(['/posts']);
    }
    this.loadComments();
    this.checkIfLiked();
  }

  likePost(): void {
    if (!this.post) return;
    
    if (this.isPostLiked) {
      this.postService.unlikePost(this.post.id);
      this.post.likes--;
      this.isPostLiked = false;
    } else {
      this.postService.likePost(this.post.id);
      this.post.likes++;
      this.isPostLiked = true;
    }
  }

  checkIfLiked(): void {
    const likedPosts = localStorage.getItem('liked_posts');
    if (likedPosts && this.post) {
      const likedArray = JSON.parse(likedPosts);
      this.isPostLiked = likedArray.includes(this.post.id);
    }
  }

  loadComments(): void {
    const savedComments = localStorage.getItem(`comments_post_${this.post?.id}`);
    if (savedComments) {
      this.comments = JSON.parse(savedComments);
    } else {
      this.comments = [
        {
          id: 1,
          authorName: 'John Doe',
          authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          content: 'Amazing experience! Thanks for sharing!',
          createdAt: new Date()
        }
      ];
      this.saveComments();
    }
  }

  saveComments(): void {
    localStorage.setItem(`comments_post_${this.post?.id}`, JSON.stringify(this.comments));
    if (this.post) {
      this.post.comments = this.comments.length;
      const posts = this.postService.getPosts();
      const postIndex = posts.findIndex(p => p.id === this.post?.id);
      if (postIndex !== -1) {
        posts[postIndex].comments = this.comments.length;
        localStorage.setItem('mt_posts', JSON.stringify(posts));
      }
    }
  }

  addComment(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.newComment.trim() && this.post) {
      const user = this.authService.getCurrentUser();
      const newCommentObj: Comment = {
        id: Date.now(),
        authorName: user?.name || 'Anonymous',
        authorAvatar: user?.avatar,
        content: this.newComment.trim(),
        createdAt: new Date()
      };
      
      this.comments.push(newCommentObj);
      this.saveComments();
      this.newComment = '';
    }
  }
}