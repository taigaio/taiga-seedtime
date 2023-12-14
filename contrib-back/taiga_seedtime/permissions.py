# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

from taiga.base.api.permissions import TaigaResourcePermission

from taiga.permissions.permissions import HasProjectPerm


class GamePermission(TaigaResourcePermission):
    retrieve_perms = HasProjectPerm('modify_us')
    create_perms = HasProjectPerm('modify_us')
    update_perms = HasProjectPerm('modify_us')
    partial_update_perms = HasProjectPerm('modify_us')
    destroy_perms = HasProjectPerm('modify_us')
    list_perms = HasProjectPerm('modify_us')


class EstimatePermission(TaigaResourcePermission):
    retrieve_perms = HasProjectPerm('view_us')
    create_perms = HasProjectPerm('view_us')
    update_perms = HasProjectPerm('view_us')
    partial_update_perms = HasProjectPerm('view_us')
    destroy_perms = HasProjectPerm('view_us')
    list_perms = HasProjectPerm('view_us')
