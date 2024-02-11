from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from base.models import User, Chat
from .serializers import ChatSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import getOffers, newOffer, getOffer, updateOffer, deleteOffer, getMessages, sendMessage, deleteMessage, \
    getUsers, newUser, getUser, deleteUser, updateUser


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['user_type'] = user.user_type
        token['is_active'] = user.is_active
        token['is_staff'] = user.is_staff
        if user.user_type == 'Student':
            token['field_of_study'] = user.student.field_of_study
            token['student_id'] = user.student.student_id
        elif user.user_type == 'Company':
            token['name'] = user.company.name
            token['description'] = user.company.description
            token['location'] = user.company.location
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(username=request.data['username'])
        user.last_login = timezone.now()
        user.save()
        return response


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
def usersView(request):
    if request.method == 'GET':
        return getUsers()

    if request.method == 'POST':
        return newUser(request)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def userView(request, pk):
    if request.method == 'GET':
        return getUser(pk)

    if request.method == 'PUT':
        return updateUser(request, pk)

    if request.method == 'DELETE':
        return deleteUser(pk)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def offersView(request):
    if request.method == 'GET':
        return getOffers()

    if request.method == 'POST':
        return newOffer(request)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def offerView(request, pk):
    if request.method == 'GET':
        return getOffer(pk)

    if request.method == 'PUT':
        return updateOffer(request, pk)

    if request.method == 'DELETE':
        return deleteOffer(pk)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getChats(request):
    user_id = request.user.id
    chats = Chat.objects.filter(sender_id=user_id) | Chat.objects.filter(receiver_id=user_id)
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newChat(request, receiver_id):
    receiver = User.objects.get(pk=receiver_id)
    sender = request.user
    chat, created = Chat.objects.get_or_create(
        sender=sender,
        receiver=receiver
    )
    if created:
        serializer = ChatSerializer(chat)
        return Response(serializer.data)
    else:
        return Response({'Chat already exists!'})


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def messagesView(request, chat_id):
    if request.method == 'GET':
        return getMessages(request, chat_id)

    if request.method == 'POST':
        return sendMessage(request, chat_id)

    if request.method == 'DELETE':
        return deleteMessage(chat_id)
