# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

import uuid

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

from taiga.base.db.models.fields import JSONField
from taiga.projects.occ import OCCModelMixin
from taiga.projects.models import Project
from taiga.projects.userstories.models import UserStory


class Game(OCCModelMixin, models.Model):
    uuid = models.CharField(max_length=32, editable=False, null=True,
                            blank=True, default=None, db_index=True)
    name = models.CharField(max_length=250, null=False, blank=False,
                            verbose_name=_("name"))
    project = models.ForeignKey(Project, null=False, blank=False, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now,
                                      verbose_name=_("create at"))
    end_at = models.DateTimeField(null=True, blank=True)
    roles = JSONField(null=True, blank=True)
    discard = JSONField(null=True, blank=True)
    notnow = JSONField(null=True, blank=True)
    _importing = None

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = uuid.uuid4().hex
        return super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Game"
        verbose_name_plural = "Games"
        ordering = ["project", "name", "uuid"]
        unique_together = ("project", "uuid")

    def __str__(self):
        return self.name


class Scale(models.Model):
    game = models.ForeignKey(Game, null=False, blank=False, on_delete=models.CASCADE)
    name = models.CharField(max_length=250, null=False, blank=False,
                            verbose_name=_("name"))
    order = models.IntegerField(null=True)


class GameUsScale(models.Model):
    game = models.ForeignKey(Game, null=False, blank=False, on_delete=models.CASCADE)
    userstory = models.ForeignKey(UserStory, null=False, blank=False, on_delete=models.CASCADE)
    scale = models.ForeignKey(Scale, null=True, blank=True, on_delete=models.CASCADE)


class Estimate(models.Model):
    project = models.ForeignKey(Project, null=False, blank=False, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, null=False, blank=False, on_delete=models.CASCADE)
    userstory = models.ForeignKey(UserStory, null=False, blank=False, on_delete=models.CASCADE)
    estimate_value = models.CharField(max_length=250, null=False, blank=False,
                                      verbose_name=_("name"))
    game_name = models.CharField(max_length=250, null=False, blank=False,
                                 verbose_name=_("name"))
    created_date = models.DateTimeField(null=False, blank=False,
                                        verbose_name=_("created date"),
                                        default=timezone.now)
    modified_date = models.DateTimeField(null=False, blank=False,
                                         verbose_name=_("modified date"))

    def save(self, *args, **kwargs):
        self.modified_date = timezone.now()
        return super().save(*args, **kwargs)
