# Generated by Django 2.1 on 2018-08-17 22:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_music_artist'),
    ]

    operations = [
        migrations.AddField(
            model_name='music',
            name='title',
            field=models.CharField(default='Song Title', max_length=100),
        ),
    ]
