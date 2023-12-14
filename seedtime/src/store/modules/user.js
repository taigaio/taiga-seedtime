/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { userService } from '@/api'
import * as types from '@/store/mutation-types'

const state = {
  me: {},
  userDefaultImages: {
    images: [
      'user-avatar-01.png',
      'user-avatar-02.png',
      'user-avatar-03.png',
      'user-avatar-04.png',
      'user-avatar-05.png'
    ],
    colors: [
      'rgba( 178, 176, 204, 1 )',
      'rgba( 183, 203, 131, 1 )',
      'rgba( 210, 198, 139, 1 )',
      'rgba( 214, 161, 212, 1 )',
      'rgba( 247, 154, 154, 1 )'
    ]
  }
}

const getters = {
  getUserDefaultImage: (state) => {
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))))
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a)
    return cartesian(state.userDefaultImages.colors, state.userDefaultImages.images)
  }
}

// Actions
const actions = {
  async setMe ({ commit, state }, payload) {
    if (Object.keys(state.me).length) {
      return state.me
    }

    const me = await userService.me()
    commit(types.SET_ME_USER, me)
    return me
  }
}

const mutations = {
  [types.SET_ME_USER] (state, me) {
    state.me = me
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
