from rest_framework import serializers
from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title']


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    category_title = serializers.ReadOnlyField(source='category.title')

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'description',
            'content',
            'image',
            'created_at',
            'author',
            'author_username',
            'category',
            'category_title',
        ]
        read_only_fields = ['author', 'created_at']