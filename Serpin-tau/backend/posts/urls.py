from django.urls import path
from .views import (
    PostListAPIView,
    PostCreateAPIView,
    PostDetailAPIView,
    CategoryListAPIView,
    CategoryDetailAPIView,
)

urlpatterns = [
    path('posts/', PostListAPIView.as_view(), name='posts-list'),
    path('posts/create/', PostCreateAPIView.as_view(), name='posts-create'),
    path('posts/<int:id>/', PostDetailAPIView.as_view(), name='post-detail'),

    path('categories/', CategoryListAPIView.as_view(), name='categories-list'),
    path('categories/<int:id>/', CategoryDetailAPIView.as_view(), name='category-detail'),
]