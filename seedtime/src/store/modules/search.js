/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import { userStoriesService } from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  currentUS: {},
  currentAttachments: {}
}

const actions = {
  async getAttachment ({ commit }, { projectID, userStoryID }) {
    const attachments = await userStoriesService.usAttachment(
      projectID,
      userStoryID
    )
    commit(types.SET_CURRENT_ATTACHMENTS, attachments)
  }
}

const mutations = {
  [types.SET_CURRENT_US] (state, currentUS) {
    state.currentUS = currentUS
  },
  [types.SET_CURRENT_ATTACHMENTS] (state, currentAttachments) {
    const notDeprecated = currentAttachments.filter(attachment => !attachment.is_deprecated)
    state.currentAttachments = notDeprecated
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
