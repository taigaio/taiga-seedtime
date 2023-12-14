/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import _pick from 'lodash.pick'

export default http => ({
  async projectList (userId = undefined) {
    let result = await http.get(
      'projects',
      {
        params: {
          member: userId,
          order_by: 'user_order',
          slight: true
        }
      }
    )

    return result.data
      .filter(project => !project.blocked_code)
      .map(item => _pick(
        item,
        ['id',
          'slug',
          'logo_small_url',
          'name',
          'description',
          'my_permissions',
          'is_private',
          'modified_date'
        ]
      ))
  },
  async projectDetail (projectSlug) {
    let result = await http.get(
      'projects/by_slug',
      {
        params: {
          slug: projectSlug
        }
      }
    )

    result.data.points = result.data.points.map(item => _pick(item, ['id', 'name', 'order']))
    result.data.roles = result.data.roles
      .filter(item => item.computable)
      .map(item => _pick(item, ['id', 'name']))

    return _pick(result.data, ['id', 'name', 'slug', 'points', 'roles', 'my_permissions', 'is_backlog_activated'])
  },
  async projectMilestones (projectId, usList = []) {
    let result = await http.get(
      'milestones',
      {
        params: {
          project: projectId,
          closed: false
        }
      }
    )

    let usTotal = result.data.reduce((acc, current) => {
      return current.user_stories.filter(
        us => !us.status_extra_info.is_closed && !usList.includes(us.id)
      ).length + acc
    }, 0)
    return usTotal
  }
})
