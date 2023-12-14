# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

def attach_estimates(queryset, as_field="estimates_attr"):
    model = queryset.model

    sql = """SELECT json_agg(row_to_json(t))
                FROM(
                    SELECT
                        taiga_seedtime_estimate.estimate_value,
                        taiga_seedtime_estimate.game_name,
                        taiga_seedtime_estimate.created_date,
                        taiga_seedtime_estimate.modified_date,
                        taiga_seedtime_estimate.game_id,
                        taiga_seedtime_estimate.project_id
                    FROM taiga_seedtime_estimate
                    WHERE taiga_seedtime_estimate.userstory_id = {tbl}.id
                    ORDER BY taiga_seedtime_estimate.modified_date DESC) t"""

    sql = sql.format(tbl=model._meta.db_table)
    queryset = queryset.extra(select={as_field: sql})
    return queryset
