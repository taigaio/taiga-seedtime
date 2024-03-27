/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import user from '@/store/modules/user'

describe('Vuex User Mutations', () => {
  it('SET_ME_USER', () => {
    const me = {
      id: 5,
      username: 'admin',
      photo: null,
      gravatar_id: '64e1b8d34f425d19e1ee2ea7236d3028',
      color: '',
      lang: ''
    }
    user.state.me = {}

    user.mutations.SET_ME_USER(user.state, me)
    expect(user.state.me).toBe(me)
  })
})
