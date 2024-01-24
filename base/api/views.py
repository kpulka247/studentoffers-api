from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from base.models import Offer, Job, Internship, Apprenticeship, User, Student, Company, Message, Chat
from .serializers import OfferSerializer, JobSerializer, \
    InternshipSerializer, ApprenticeshipSerializer, UserSerializer, StudentSerializer, CompanySerializer, \
    MessageSerializer, ChatSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.files import File


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
def createUser(request):
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getChats(request):
    chats = Chat.objects.all()
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createChat(request, receiver_id):
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


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteChat(request, chat_id):
    chat = Chat.objects.get(pk=chat_id)
    chat.delete()
    return Response('Chat was deleted!')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMessages(request, chat_id):
    messages = Message.objects.filter(chat__id=chat_id)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def sendMessage(request, chat_id):
    chat = Chat.objects.get(pk=chat_id)
    user = request.user
    serializer = MessageSerializer(data=request.data)
    if serializer.is_valid():
        content = serializer.validated_data.get('content')
        file = request.FILES.get('file')
        if not content and not file:
            return Response({'The message must contain body or file!'})
        if file:
            serializer.save(chat=chat, user=user, file=File(file))
        else:
            serializer.save(chat=chat, user=user)
        return Response(serializer.data)
    else:
        return Response(serializer.errors)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOffers(request):
    offers = Offer.objects.all()
    serializer = OfferSerializer(offers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOffer(request, pk):
    offers = Offer.objects.get(id=pk)
    serializer = OfferSerializer(offers, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOffer(request):
    data = request.data
    offer_type = data['offer_type']
    if offer_type == 'Job':
        offer = Job.objects.create(
            name=data['name'],
            company=Company.objects.get(id=data['company']),
            requirements=data['requirements'],
            offer=data['offer'],
            offer_type=offer_type,
            salary=data['job']['salary'],
            employment_type=data['job']['employment_type']
        )
        serializer = JobSerializer(offer, many=False)
    elif offer_type == 'Internship':
        offer = Internship.objects.create(
            name=data['name'],
            company=Company.objects.get(id=data['company']),
            requirements=data['requirements'],
            offer=data['offer'],
            offer_type=offer_type,
            stipend=data['internship']['stipend'],
            academic_credit=data['internship']['academic_credit']
        )
        serializer = InternshipSerializer(offer, many=False)
    elif offer_type == 'Apprenticeship':
        offer = Apprenticeship.objects.create(
            name=data['name'],
            company=Company.objects.get(id=data['company']),
            requirements=data['requirements'],
            offer=data['offer'],
            offer_type=offer_type,
        )
        serializer = ApprenticeshipSerializer(offer, many=False)
    else:
        return Response({'Invalid offer type!'}, status=400)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOffer(request, pk):
    data = request.data
    offer = Offer.objects.get(id=pk)
    serializer = OfferSerializer(instance=offer, data=data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteOffer(request, pk):
    offer = Offer.objects.get(id=pk)
    offer.delete()
    return Response('Offer was deleted!')
