from rest_framework.serializers import ModelSerializer, Serializer
from base.models import User, Student, Company, Offer, Job, Internship, Chat, Message


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'first_name', 'last_name', 'field_of_study', 'student_id')


class CompanySerializer(ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'name', 'description', 'location')


class UserSerializer(ModelSerializer):
    student = StudentSerializer(many=False, read_only=True)
    company = CompanySerializer(many=False, read_only=True)

    class Meta:
        model = User
        fields = '__all__'


class ChatSerializer(ModelSerializer):
    sender = UserSerializer(many=False, read_only=True)
    receiver = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Chat
        fields = '__all__'


class MessageSerializer(ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    chat = ChatSerializer(many=False, read_only=True)

    class Meta:
        model = Message
        fields = ('user', 'chat', 'content', 'created_at', 'file')


class JobSerializer(ModelSerializer):
    class Meta:
        model = Job
        fields = ('salary', 'employment_type')


class InternshipSerializer(ModelSerializer):
    class Meta:
        model = Internship
        fields = ('stipend', 'academic_credit')


class ApprenticeshipSerializer(Serializer):
    pass


class OfferSerializer(ModelSerializer):
    company = CompanySerializer(many=False, read_only=True)
    job = JobSerializer(many=False, read_only=True)
    internship = InternshipSerializer(many=False, read_only=True)

    class Meta:
        model = Offer
        fields = '__all__'
