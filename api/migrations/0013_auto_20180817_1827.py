# Generated by Django 2.1 on 2018-08-17 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20180817_1820'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='type_of_user',
            field=models.CharField(choices=[('user', 'User'), ('superadmin', 'Super Admin')], max_length=11),
        ),
    ]
