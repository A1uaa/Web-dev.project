// src/app/features/posts/post-list/post-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { TourService } from '../../../services/tour.service';
import { Post } from '../../../models/post.model';
import { Tour } from '../../../models/tour.model';
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PostCardComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  searchTerm = '';
  categories = ['Hiking', 'Trekking', 'Camping', 'Mountaineering'];
  popularTours: Tour[] = [];  // ✅ Добавлено
  likedPosts: Set<number> = new Set();

  constructor(
    public postService: PostService,
    public authService: AuthService,
    private tourService: TourService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.posts = this.postService.getPosts();
    this.popularTours = this.tourService.getTours().slice(0, 3);
    this.loadLikedStatus();
  }

  get filteredPosts(): Post[] {
    return this.posts.filter(post =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleLike(event: { id: number, isLiked: boolean }): void {
    const post = this.posts.find(p => p.id === event.id);
    if (!post) return;

    if (event.isLiked) {
      this.postService.likePost(event.id);
      post.likes++;
      this.likedPosts.add(event.id);
    } else {
      this.postService.likePost(event.id);
      if (post.likes > 0) post.likes--;
      this.likedPosts.delete(event.id);
    }
    
    this.saveLikedStatus();
  }

  openPostDetail(postId: number): void {  
    this.router.navigate(['/posts', postId]);
  }

  private loadLikedStatus(): void {
    const saved = localStorage.getItem('liked_posts');
    if (saved) {
      const likedArray = JSON.parse(saved);
      this.likedPosts = new Set(likedArray);
    }
  }

  private saveLikedStatus(): void {
    localStorage.setItem('liked_posts', JSON.stringify(Array.from(this.likedPosts)));
  }
}