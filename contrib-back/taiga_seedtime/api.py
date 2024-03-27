# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos INC

from taiga.base import response
from taiga.base import filters as base_filters
from taiga.base.api import ModelCrudViewSet, ModelListViewSet, GenericViewSet
from taiga.base.api.utils import get_object_or_404
from taiga.base.decorators import detail_route
from taiga.projects.occ import OCCResourceMixin
from taiga.projects.models import Project
from taiga.projects.userstories.models import UserStory
from taiga.projects.userstories.utils import attach_total_points, attach_role_points, attach_basic_attachments

from . import filters
from . import models
from . import permissions
from . import services
from . import serializers
from . import utils
from . import validators


class GameViewSet(OCCResourceMixin, ModelCrudViewSet):
    model = models.Game
    serializer_class = serializers.GameSerializer
    validator_class = validators.GameValidator
    permission_classes = (permissions.GamePermission,)
    lookup_field = "uuid"
    lookup_value_regex = "[a-f0-9]+"

    def get_object(self, queryset=None):
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, **self.kwargs)
        return obj

    @detail_route(methods=["POST"])
    def commit(self, request, uuid):
        game = self.get_object()
        services.bulk_update_or_create_estimate(game)
        return response.Ok(uuid)

    @detail_route(methods=["POST"])
    def create(self, request, *args, **kwargs):
        scales_data = request.DATA.pop('scales')
        scales = validators.validate_scales(scales_data)

        userstories_data = request.DATA.pop('userstories')
        project = Project.objects.get(id=request.DATA.get('project'))
        userstories = validators.validate_userstories(project, userstories_data)

        game_response = super().create(request, *args, **kwargs)
        if game_response.status_code != 201:
            return response

        services.create_scales(self.object, scales)
        services.create_game_us_scales(self.object, userstories)

        serializer = self.get_serializer(self.object)
        headers = self.get_success_headers(serializer.data)
        return response.Created(serializer.data, headers=headers)

    @detail_route(methods=["PATCH"])
    def update(self, request, *args, **kwargs):
        game = self.get_object()
        userstories_data = request.DATA.pop('userstories')
        userstories = validators.validate_userstories(game.project, userstories_data)

        for userstory in userstories:
            if userstory['id'] in request.DATA['discard']:
                request.DATA['discard'].remove(userstory['id'])

        game_response = super().update(request, *args, **kwargs)
        if game_response.status_code != 200:
            return response

        services.update_game_us_scales(game, userstories)

        serializer = self.get_serializer(game)
        headers = self.get_success_headers(serializer.data)
        return response.Created(serializer.data, headers=headers)


class UsViewSetBase(GenericViewSet):
    serializer_class = serializers.UserStorySerializer
    queryset = UserStory.objects.all()
    permission_classes = (permissions.GamePermission,)

    def attach_extra_info(self, queryset):
        queryset = attach_total_points(queryset)
        queryset = attach_role_points(queryset)
        queryset = attach_basic_attachments(queryset)
        queryset = utils.attach_estimates(queryset)
        queryset = queryset.extra(select={"include_attachments": "True"})

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = self.attach_extra_info(queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_pagination_serializer(page)
        else:
            serializer = self.get_serializer(queryset, many=True)

        return response.Ok(serializer.data)


class UsViewSet(UsViewSetBase):
    filter_backends = (
        base_filters.CanViewUsFilterBackend,
        filters.IdsFilter,
    )


class GameUsCandidateViewSet(UsViewSetBase):
    filter_backends = (
        base_filters.CanViewUsFilterBackend,
        base_filters.StatusesFilter,
        base_filters.TagsFilter,
        filters.GameUsCandidateFilterBackend,
    )
    filter_fields = ["milestone__isnull",
                     "status__is_archived",
                     "status__is_closed"]


class EstimateViewSet(ModelListViewSet):
    queryset = models.Estimate.objects.select_related("game", "project")
    serializer_class = serializers.EstimateSerializer
    permission_classes = (permissions.EstimatePermission,)
    filter_backends = (
        base_filters.CanViewUsFilterBackend,
    )
    filter_fields = ["project", "userstory"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        return response.Ok(serializer.data)
