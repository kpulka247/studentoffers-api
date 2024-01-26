from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from base.models import User, Student, Company, Chat
from .serializers import UserSerializer, StudentSerializer, CompanySerializer, ChatSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import getOffers, newOffer, getOffer, updateOffer, deleteOffer, getMessages, sendMessage, deleteMessage


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['user_type'] = user.user_type
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


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request, pk):
    users = User.objects.get(id=pk)
    serializer = UserSerializer(users, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def newUser(request):
    data = request.data
    user_type = data['user_type']
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')
    if user_type == 'Student':
        student = Student.objects.create(
            username=username,
            email=data['email'],
            password=password,
            first_name=first_name,
            last_name=last_name,
            field_of_study=data['student']['field_of_study'],
            student_id=data['student']['student_id'],
            user_type=user_type
        )
        student.set_password(password)
        student.save()
        serializer = StudentSerializer(student, many=False)
    elif user_type == 'Company':
        company = Company.objects.create(
            username=username,
            email=data['email'],
            password=password,
            first_name=first_name,
            last_name=last_name,
            name=data['company']['name'],
            description=data['company']['description'],
            location=data['company']['location'],
            user_type=user_type
        )
        company.set_password(password)
        company.save()
        serializer = CompanySerializer(company, many=False)
    else:
        return Response({'Invalid user type!'}, status=400)

    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def offers(request):
    if request.method == 'GET':
        return getOffers()

    if request.method == 'POST':
        return newOffer(request)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def offer(request, pk):
    if request.method == 'GET':
        return getOffer(pk)

    if request.method == 'PUT':
        return updateOffer(request, pk)

    if request.method == 'DELETE':
        return deleteOffer(pk)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getChats(request):
    chats = Chat.objects.all()
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
def messages(request, chat_id):
    if request.method == 'GET':
        return getMessages(chat_id)

    if request.method == 'POST':
        return sendMessage(request, chat_id)

    if request.method == 'DELETE':
        return deleteMessage(chat_id)
