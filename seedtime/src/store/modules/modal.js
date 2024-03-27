/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import * as types from '@/store/mutation-types'

const SHOULD_NOT_CLOSE_SEARCH = ['showUsDetail']
const state = {
  current: undefined,
  search: false,
  notify: false,
  types: ['addUs', 'addExisting', 'search', 'showUsDetail', 'notify'],
  notifyText: undefined,
  notifyError: false
}

const mutations = {
  [types.OPEN_MODAL] (state, type) {
    if (type === 'search') {
      state.search = true
    }

    if (type === 'notify') {
      state.notify = true
    }

    if (state.current) {
      state.notify = false
    }

    if (state.types.includes(type)) {
      state.current = type
    }
  },
  [types.CLOSE_MODAL] (state) {
    if (!SHOULD_NOT_CLOSE_SEARCH.includes(state.current)) {
      state.search = false
      state.notify = false
    }

    state.current = undefined
  },
  [types.NOTIFY_TEXT] (state, data) {
    state.notifyText = data.text
    state.notifyError = data.error
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
