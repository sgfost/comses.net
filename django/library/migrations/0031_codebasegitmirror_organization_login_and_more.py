# Generated by Django 4.2.14 on 2024-09-06 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("library", "0030_license_text"),
    ]

    operations = [
        migrations.AddField(
            model_name="codebasegitmirror",
            name="organization_login",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="codebasegitmirror",
            name="user_access_token",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
