from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', views.usersView, name='users'),
    path('users/<str:pk>/', views.userView, name='user'),
    path('chats/', views.getChats, name='chats'),
    path('chats/new/<int:receiver_id>/', views.newChat, name='new-chat'),
    path('chats/<int:chat_id>/', views.messagesView, name='messages'),
    path('offers/', views.offersView, name='offers'),
    path('offers/<str:pk>/', views.offerView, name='offer'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + \
                   static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
