# Generated by Django 3.2.19 on 2023-06-27 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_alter_memberprofile_industry'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='job',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]