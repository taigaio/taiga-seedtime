# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

from taiga.base import routers

from taiga_seedtime.api import GameViewSet, GameUsCandidateViewSet, EstimateViewSet, UsViewSet


router = routers.DefaultRouter(trailing_slash=False)

router.register(r"games", GameViewSet, base_name="games")
router.register(r"game-candidate-us", GameUsCandidateViewSet, base_name="game-candidate-us")
router.register(r"userstories", UsViewSet, base_name="userstories")
router.register(r"estimates", EstimateViewSet, base_name="estimates")
