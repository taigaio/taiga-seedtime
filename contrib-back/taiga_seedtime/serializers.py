# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

from taiga.base.api import serializers
from taiga.base.fields import Field, MethodField
from taiga.mdrender.service import render as mdrender
from taiga.projects.mixins.serializers import StatusExtraInfoSerializerMixin
from taiga.projects.tagging.serializers import TaggedInProjectResourceSerializer


class GameSerializer(serializers.LightSerializer):
    id = Field()
    uuid = Field()
    name = Field()
    project = Field(attr="project_id")
    created_at = Field()
    end_at = Field()
    userstories = MethodField()
    scales = MethodField()
    roles = Field()
    discard = Field()
    notnow = Field()

    def get_scales(self, obj):
        return [{
            "id": scale.id,
            "name": scale.name,
            "order": scale.order,
        } for scale in obj.scale_set.order_by('order')]

    def get_userstories(self, obj):
        return [{
            "id": game_us_scale.userstory.id,
            "scale_id": game_us_scale.scale_id,
        } for game_us_scale in obj.gameusscale_set.exclude(userstory_id__in=obj.discard)]


class UserStorySerializer(StatusExtraInfoSerializerMixin, TaggedInProjectResourceSerializer,
                          serializers.LightSerializer):
    id = Field()
    ref = Field()
    subject = Field()
    is_blocked = Field()
    project = Field(attr="project_id")
    version = Field()
    description_html = MethodField()
    points = MethodField()
    total_points = MethodField()
    estimates = MethodField()

    def get_description_html(self, obj):
        return mdrender(obj.project, obj.description)

    def get_total_points(self, obj):
        assert hasattr(obj, "total_points_attr"), "instance must have a total_points_attr attribute"
        return obj.total_points_attr

    def get_points(self, obj):
        assert hasattr(obj, "role_points_attr"), "instance must have a role_points_attr attribute"
        if obj.role_points_attr is None:
            return {}

        return obj.role_points_attr

    def get_estimates(self, obj):
        assert hasattr(obj, "estimates_attr"), "instance must have a estimates_attr attribute"
        return obj.estimates_attr


class EstimateSerializer(serializers.LightSerializer):
    id = Field()
    project = Field(attr="project_id")
    project_slug = MethodField()
    userstory = Field(attr="userstory_id")
    game = MethodField()
    estimate_value = Field()
    modified_date = Field()

    def get_game(self, obj):
        return obj.game.uuid

    def get_project_slug(self, obj):
        return obj.project.slug
