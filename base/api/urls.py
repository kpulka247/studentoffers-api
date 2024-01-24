from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', views.getUsers, name='users'),
    path('users/create/', views.createUser, name='create-user'),
    path('users/<str:pk>/', views.getUser, name='user'),
    path('chats/', views.getChats, name='chats'),
    path('chats/create/<int:receiver_id>/', views.createChat, name='create-chat'),
    path('chats/<int:chat_id>/', views.getMessages, name='get-messages'),
    path('chats/<int:chat_id>/send/', views.sendMessage, name='send-message'),
    path('chats/<int:chat_id>/delete/', views.deleteChat, name='delete-chat'),
    path('offers/', views.getOffers, name='offers'),
    path('offers/create/', views.createOffer, name='create-offers'),
    path('offers/<str:pk>/update/', views.updateOffer, name='update-offer'),
    path('offers/<str:pk>/delete/', views.deleteOffer, name='delete-offer'),
    path('offers/<str:pk>/', views.getOffer, name='offer'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + \
                   static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
