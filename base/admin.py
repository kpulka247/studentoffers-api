from django.contrib import admin
from base.models import Job, Internship, Apprenticeship, User, Student, Company, Message, Chat


class OfferAdmin(admin.ModelAdmin):
    pass


class JobAdmin(OfferAdmin):
    list_display = ('name', 'company', 'created_at')


class InternshipAdmin(OfferAdmin):
    list_display = ('name', 'company', 'created_at')


class ApprenticeshipAdmin(OfferAdmin):
    list_display = ('name', 'company', 'created_at')


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type')


class StudentAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'student_id', 'user_type')


class CompanyAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'name', 'location')


class ChatAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver')


class MessageAdmin(ChatAdmin):
    list_display = ('user', 'chat', 'content', 'created_at')


admin.site.register(Job, JobAdmin)
admin.site.register(Internship, InternshipAdmin)
admin.site.register(Apprenticeship, ApprenticeshipAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)
