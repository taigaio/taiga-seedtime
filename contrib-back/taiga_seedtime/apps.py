# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos INC

from django.apps import AppConfig
from django.conf.urls import include, url


class TaigaSeedtimeConfig(AppConfig):
    name = "taiga_seedtime"
    verbose_name = "TaigaSeedtime"
    watched_types = 'taiga_seedtime.game',

    def ready(self):
        from taiga.urls import urlpatterns
        from .routers import router
        urlpatterns.append(url(r'^api/v1/seedtime/', include(router.urls)))
