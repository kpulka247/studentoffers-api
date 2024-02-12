# Generated by Django 4.1.5 on 2024-02-12 17:36

import base.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_alter_message_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to=base.models.upload_path, validators=[base.models.file_size]),
        ),
    ]