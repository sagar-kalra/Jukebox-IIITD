# Generated by Django 2.1 on 2018-08-17 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_vote'),
    ]

    operations = [
        migrations.AddField(
            model_name='music',
            name='artist',
            field=models.CharField(default='Unknown', max_length=100),
        ),
    ]
