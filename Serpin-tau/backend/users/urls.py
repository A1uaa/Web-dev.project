from django.urls import path
from .views import UserSignUpAPIView, UserLogoutAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/signup/', UserSignUpAPIView.as_view(), name='signup'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', UserLogoutAPIView.as_view(), name='logout'),
]