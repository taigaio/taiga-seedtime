# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos INC

from django.utils.translation import ugettext as _

from taiga.base.api import validators
from taiga.base.exceptions import ValidationError

from . import models


class GameValidator(validators.ModelValidator):
    class Meta:
        model = models.Game

    def validate_roles(self, attrs, source):
        project = attrs.get("project", None if self.object is None else self.object.project)
        if project is None:
            return attrs

        roles = attrs[source]
        if not isinstance(roles, list):
            raise ValidationError(_("Invalid roles format"))

        for role_id in roles:
            if not isinstance(role_id, int):
                raise ValidationError(_("Invalid role id format"))

            if project.roles.filter(id=role_id).count() == 0:
                raise ValidationError(_("Invalid role for the project"))

        return attrs


def validate_userstories(project, userstories):
    if not isinstance(userstories, list):
        raise ValidationError(_("Invalid user stories format"))

    for us in userstories:
        if "id" not in us:
            raise ValidationError(_("Invalid user story format"))

        if project.user_stories.filter(id=us['id']).count() == 0:
            raise ValidationError(_("Invalid user story for the project"))

    return userstories


def validate_scales(scales):
    if not isinstance(scales, list):
        raise ValidationError(_("Invalid scales format"))

    for scale in scales:
        if "id" not in scale or "name" not in scale:
            raise ValidationError(_("Invalid scale format"))

    return scales
