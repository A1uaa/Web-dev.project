from django.urls import path
from .views import MasterClassListCreateAPIView, MasterClassDetailAPIView

urlpatterns = [
    path('masterclasses/', MasterClassListCreateAPIView.as_view(), name='masterclass-list-create'),
    path('masterclasses/<int:id>/', MasterClassDetailAPIView.as_view(), name='masterclass-detail'),
]