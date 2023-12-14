/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import * as types from '@/store/mutation-types'

const state = {
  current: 1,
  total: 4,
  complete: false
}

const mutations = {
  [types.RESET_STEPS] (state) {
    state.current = 1
    state.complete = false
  },
  [types.SET_STEP] (state, step) {
    state.current = step
    state.complete = false
  },
  [types.SET_COMPLETE] (state, complete = true) {
    state.complete = complete
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
