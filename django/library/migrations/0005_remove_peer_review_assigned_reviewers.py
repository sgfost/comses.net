# Generated by Django 2.1.2 on 2018-10-30 23:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library', '0004_auto_20181025_0352'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='peerreview',
            name='assigned_reviewer',
        ),
        migrations.RemoveField(
            model_name='peerreview',
            name='assigned_reviewer_email',
        ),
        migrations.AlterField(
            model_name='peerreviewinvitation',
            name='accepted',
            field=models.NullBooleanField(choices=[(None, 'Waiting for response'), (False, 'Decline'), (True, 'Accept')], help_text='Accept or decline this peer review invitation', verbose_name='Invitation status'),
        ),
    ]
