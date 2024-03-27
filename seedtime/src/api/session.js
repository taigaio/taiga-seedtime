/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import sha1 from 'sha1'
import { sessionStorage } from '@/api/storage'

function generateUniqueSessionIdentifier () {
  const date = (new Date()).getTime()
  const randomNumber = Math.floor(Math.random() * 0x9000000)
  const components = [JSON.stringify(date), JSON.stringify(randomNumber)]
  return sha1(components.join(':'))
}

export default {
  get () {
    const sessionId = sessionStorage.get('sessionId')

    if (sessionId) {
      return sessionId
    }

    return this.set()
  },
  set () {
    const sessionId = generateUniqueSessionIdentifier()
    return sessionStorage.set('sessionId', sessionId)
  },
  remove () {
    sessionStorage.remove('sessionId')

    return true
  }
}
