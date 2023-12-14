/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import uuid from 'uuid/v4'
import session from '@/api/session'
import { localStorage } from '@/api/storage'
import router from '@/router'

const conf = window.__env || {}
const STATE_ID = uuid()

const state = {
  get () {
    return localStorage.get('state')
  },
  set () {
    return localStorage.set('state', STATE_ID)
  },
  remove () {
    localStorage.remove('state')

    return true
  }
}

export default (http, setTokenFn) => ({
  state,
  token: {
    get () {
      return localStorage.get('token')
    },
    set (newToken) {
      localStorage.set('token', newToken)

      // Clean state from localStorage, because if we have token,
      // we dont need state
      state.remove()

      setTokenFn(newToken)

      return newToken
    }
  },
  next: {
    get () {
      return localStorage.get('next')
    },
    set (nextUrl) {
      localStorage.set('next', nextUrl)

      return nextUrl
    },
    remove () {
      localStorage.remove('next')

      return true
    }
  },
  intro: {
    get () {
      return localStorage.get('intro')
    },
    set () {
      localStorage.set('intro', true)
      return true
    }
  },
  validate (authCode) {
    return http.post(
      'application-tokens/validate',
      {
        application: conf.APP_KEY,
        auth_code: authCode,
        state: this.state.get()
      }
    )
      .then(response => this.token.set(response.data.token))
  },
  async logout () {
    try {
      await http.get(`application-tokens?application=${conf.APP_KEY}`).then(response => {
        let applicationToken = response.data.pop()
        http.delete(`application-tokens/${applicationToken.id}`).then(() => {
          localStorage.clear()
          session.remove()
          router.push({name: 'login'})
        })
      })
    } catch (error) {
      console.error(error)
    }
  }
})
