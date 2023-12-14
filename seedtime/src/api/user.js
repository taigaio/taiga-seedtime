/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { localStorage } from '@/api/storage'
import _pick from 'lodash.pick'

export default http => ({
  async me () {
    const ME = localStorage.get('user')

    if (ME) {
      return ME
    }

    const user = await http.get('users/me')
    const userData = _pick(user.data, ['id', 'username', 'photo', 'gravatar_id', 'color', 'lang'])
    localStorage.set('user', userData)
    return userData
  }
})
