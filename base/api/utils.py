from django.core.files import File
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from base.models import Offer, Job, Internship, Apprenticeship, Company, Message, Chat, User, Student
from .serializers import OfferSerializer, JobSerializer, InternshipSerializer, ApprenticeshipSerializer, \
    MessageSerializer, UserSerializer, StudentSerializer, CompanySerializer


@permission_classes([IsAuthenticated])
def getUsers():
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


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
            user_type=user_type,
            is_active=False
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
            user_type=user_type,
            is_active=False
        )
        company.set_password(password)
        company.save()
        serializer = CompanySerializer(company, many=False)
    else:
        return Response({'Invalid user type!'}, status=400)
    return Response(serializer.data)


def getOffers():
    offers = Offer.objects.all()
    serializer = OfferSerializer(offers, many=True)
    return Response(serializer.data)


def newOffer(request):
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
            academic_credit=data['internship'].get('academic_credit', False)
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


def getOffer(pk):
    offers = Offer.objects.get(id=pk)
    serializer = OfferSerializer(offers, many=False)
    return Response(serializer.data)


def updateOffer(request, pk):
    data = request.data
    offer = Offer.objects.get(id=pk)
    serializer = OfferSerializer(instance=offer, data=data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


def deleteOffer(pk):
    offer = Offer.objects.get(id=pk)
    offer.delete()
    return Response('Offer was deleted!')


def getMessages(chat_id):
    messages = Message.objects.filter(chat__id=chat_id).order_by('-created_at')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


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


def deleteMessage(chat_id):
    chat = Chat.objects.get(pk=chat_id)
    chat.delete()
    return Response('Chat was deleted!')
