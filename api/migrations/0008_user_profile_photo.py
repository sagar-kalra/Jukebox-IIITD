# Generated by Django 2.1 on 2018-08-17 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20180817_1305'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_photo',
            field=models.ImageField(null=True, upload_to='profile_photo'),
        ),
    ]