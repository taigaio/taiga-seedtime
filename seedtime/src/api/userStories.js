/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import _pick from 'lodash.pick'

export default http => ({
  async userStoriesList (
    projectId,
    fulldata = true,
    page = 1,
    tags = [],
    statuses = [],
    milestone = false,
    pagination = true
  ) {
    let params = {
      status__is_archived: false,
      status__is_closed: false,
      project: projectId,
      tags: tags.join(',') || undefined,
      status: statuses.join(',') || undefined,
      full_data: true,
      page: page
    }
    if (!milestone) {
      params['milestone__isnull'] = !milestone
    }

    if (fulldata) {
      params['full_data'] = fulldata
    }

    if (!pagination) {
      http.defaults.headers.common['x-disable-pagination'] = true
    } else {
      delete http.defaults.headers.common['x-disable-pagination']
    }

    const result = await http.get(
      'userstories',
      {
        params
      }
    )

    let list = {}
    list.items = result.data.map(item => _pick(
      item,
      [
        'id',
        'ref',
        'subject',
        'tags',
        'status_extra_info',
        'is_blocked',
        'project',
        'version'
      ])
    )
    list.count = result.headers['x-pagination-count']
    return list
  },
  async userStoriesIds (ids, pagination = true) {
    if (!pagination) {
      http.defaults.headers.common['x-disable-pagination'] = true
    }

    const result = await http.get(
      'seedtime/userstories',
      {
        params: {
          id__in: ids
        }
      }
    )
    return result.data.map(item => _pick(
      item,
      [
        'id',
        'ref',
        'subject',
        'tags',
        'status_extra_info',
        'description_html',
        'is_blocked',
        'blocked_note',
        'attachments',
        'points',
        'total_points',
        'project',
        'version',
        'estimates'
      ])
    )
  },
  async userStoriesFilters (projectId, milestone = false) {
    let filters = {
      tags: [],
      statuses: []
    }

    let params = {
      project: projectId
    }

    if (!milestone) {
      params['milestone__isnull'] = !milestone
    }

    const result = await http.get(
      'userstories/filters_data',
      {
        params
      }
    )

    filters.tags = result.data.tags.filter(item => item.count)
    filters.statuses = result.data.statuses.filter(item => item.count)
    return filters
  },
  async addUs (project, subject, description) {
    const result = await http.post(
      'userstories',
      {
        project,
        subject,
        description
      }
    )

    return _pick(
      result.data,
      [
        'id',
        'ref',
        'subject',
        'tags',
        'description_html',
        'is_blocked',
        'attachments',
        'points',
        'total_points',
        'project'
      ]
    )
  },
  async addBulkUs (projectId, stories) {
    const result = await http.post(
      'userstories/bulk_create',
      {
        project_id: projectId,
        bulk_stories: stories
      }
    )

    return result.data.map(item => _pick(
      item,
      [
        'id',
        'ref',
        'subject',
        'tags',
        'description_html',
        'is_blocked',
        'attachments',
        'points',
        'total_points',
        'project'
      ]
    ))
  },
  async usAttachment (projectId, uuid) {
    const result = await http.get(`userstories/attachments?object_id=${uuid}&project=${projectId}`)

    return result.data.map(attachments => _pick(
      attachments,
      [
        'id',
        'object_id',
        'name',
        'description_html',
        'preview_url',
        'url',
        'is_deprecated'
      ]
    ))
  },
  async usUpdate (uuid, data, version = 1) {
    let userStory = { version, ...data }

    const result = await http.patch(`userstories/${uuid}`, userStory)

    return _pick(
      result.data,
      [
        'id',
        'ref',
        'subject',
        'description_html',
        'is_blocked',
        'blocked_note',
        'attachments',
        'points',
        'total_points',
        'project',
        'version'
      ]
    )
  },
  async addUsToGame (
    uuid,
    fulldata = false,
    page = 1,
    tags = [],
    statuses = [],
    milestone = true,
    pagination = true,
    discard = false
  ) {
    let params = {
      uuid,
      status__is_archived: false,
      status__is_closed: false,
      discard: discard,
      tags: tags.join(',') || undefined,
      status: statuses.join(',') || undefined,
      full_data: fulldata,
      page: page
    }
    if (!milestone) {
      params['milestone__isnull'] = !milestone
    }

    if (fulldata) {
      params['full_data'] = fulldata
    }

    if (!pagination) {
      http.defaults.headers.common['x-disable-pagination'] = true
    } else {
      delete http.defaults.headers.common['x-disable-pagination']
    }

    const candidateUs = await http.get(
      'seedtime/game-candidate-us',
      {
        params
      }
    )
    let list = {}
    list.items = candidateUs.data.map(item => _pick(
      item,
      [
        'id',
        'ref',
        'subject',
        'tags',
        'status_extra_info',
        'description_html',
        'is_blocked',
        'blocked_note',
        'attachments',
        'points',
        'total_points',
        'project',
        'version'
      ])
    )
    list.count = candidateUs.headers['x-pagination-count']
    return list
  }
})
