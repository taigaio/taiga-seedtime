# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos INC

from taiga.base.filters import FilterBackend

from . import models


class GameUsCandidateFilterBackend(FilterBackend):
    def filter_queryset(self, request, queryset, view):
        if "uuid" not in request.QUERY_PARAMS:
            return queryset.none()

        try:
            game = models.Game.objects.get(uuid=request.QUERY_PARAMS["uuid"])
        except models.Game.DoesNotExist:
            return queryset.none()

        game_us_ids = game.gameusscale_set.values_list('userstory_id', flat=True)
        discard_ids = game.discard if request.GET.get('discard') != 'true' else []

        exclude_ids = list(set(game_us_ids) | set(discard_ids))

        return queryset.filter(project=game.project).exclude(id__in=exclude_ids)


class IdsFilter(FilterBackend):
    filter_name = 'id__in'

    def __init__(self, filter_name=None):
        if filter_name:
            self.filter_name = filter_name

    def _get_id_queryparams(self, params):
        ids = params.get(self.filter_name, None)
        if ids:
            return ids.split(",")

        return None

    def filter_queryset(self, request, queryset, view):
        query_ids = self._get_id_queryparams(request.QUERY_PARAMS)

        if query_ids:
            queryset = queryset.filter(id__in=query_ids)

        return super().filter_queryset(request, queryset, view)
