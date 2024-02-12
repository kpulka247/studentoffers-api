import os

from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    user_type = models.CharField(max_length=20)
    is_active = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'User'


class Student(User):
    field_of_study = models.CharField(max_length=100)
    student_id = models.CharField(max_length=20, unique=True)

    class Meta:
        verbose_name = 'Student'

    def save(self, *args, **kwargs):
        self.user_type = 'Student'
        super().save(*args, **kwargs)


class Company(User):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=800)
    location = models.CharField(max_length=200)

    class Meta:
        verbose_name = 'Company'

    def save(self, *args, **kwargs):
        self.user_type = 'Company'
        super().save(*args, **kwargs)


class Chat(models.Model):
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='receiver', on_delete=models.CASCADE)


def file_size(value):
    max_size = 500 * 1024 * 1024
    if value.size > max_size:
        raise ValidationError('File is too large. Max file size is 500 MB.')


def upload_path(self, filename):
    base_path = f'chats/{self.chat.id}/'
    return os.path.join(base_path, filename)


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    file = models.FileField(
        upload_to=upload_path,
        blank=True,
        null=True,
        validators=[file_size]
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Offer(models.Model):
    name = models.CharField(max_length=100)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    requirements = models.TextField()
    offer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    offer_type = models.CharField(max_length=20)


class Job(Offer):
    salary = models.DecimalField(max_digits=10, decimal_places=0)
    employment_type = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'Job'

    def save(self, *args, **kwargs):
        self.offer_type = 'Job'
        super().save(*args, **kwargs)


class Internship(Offer):
    stipend = models.DecimalField(max_digits=10, decimal_places=0)
    academic_credit = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Internship'

    def save(self, *args, **kwargs):
        self.offer_type = 'Internship'
        super().save(*args, **kwargs)


class Apprenticeship(Offer):
    class Meta:
        verbose_name = 'Apprenticeship'

    def save(self, *args, **kwargs):
        self.offer_type = 'Apprenticeship'
        super().save(*args, **kwargs)
