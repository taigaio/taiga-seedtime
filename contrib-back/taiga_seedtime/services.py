# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

from django.db import transaction

from . import models


@transaction.atomic
def bulk_update_or_create_estimate(game):
    for gameusscale in game.gameusscale_set.all():
        if not gameusscale.scale:
            continue
        models.Estimate.objects.update_or_create(
            project=game.project,
            userstory_id=gameusscale.userstory_id,
            defaults={
                "game": game,
                "game_name": game.name,
                "estimate_value": gameusscale.scale.name,
            }
        )

@transaction.atomic
def create_scales(game, scales):
    for scale in scales:
        models.Scale.objects.create(
            game=game,
            name=scale["name"],
            order=scale["order"]
        )


@transaction.atomic
def create_game_us_scales(game, userstories):
    for userstory in userstories:
        models.GameUsScale.objects.create(
            game=game,
            scale=None,
            userstory_id=userstory['id']
        )


@transaction.atomic
def update_game_us_scales(game, userstories):
    for userstory in userstories:
        models.GameUsScale.objects.update_or_create(
            game=game,
            userstory_id=userstory['id'],
            defaults={'scale_id': userstory.get('scale_id')},
        )

    for gameusscale in models.GameUsScale.objects\
            .filter(userstory_id__in=game.discard):
        gameusscale.delete()
