# Generated by Django 2.1 on 2018-08-18 01:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_music_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='steem_posting_key',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
