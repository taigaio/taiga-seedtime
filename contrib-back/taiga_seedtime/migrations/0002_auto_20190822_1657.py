# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos INC

# Generated by Django 1.11.21 on 2019-08-22 16:57
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('userstories', '0017_userstory_generated_from_task'),
        ('taiga_seedtime', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameUsScale',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Scale',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, verbose_name='name')),
                ('order', models.IntegerField(null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='game',
            name='scales',
        ),
        migrations.RemoveField(
            model_name='game',
            name='userstories',
        ),
        migrations.AddField(
            model_name='scale',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taiga_seedtime.Game'),
        ),
        migrations.AddField(
            model_name='gameusscale',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taiga_seedtime.Game'),
        ),
        migrations.AddField(
            model_name='gameusscale',
            name='scale',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='taiga_seedtime.Scale'),
        ),
        migrations.AddField(
            model_name='gameusscale',
            name='userstory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='userstories.UserStory'),
        ),
    ]
