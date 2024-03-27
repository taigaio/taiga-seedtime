/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import axios from 'axios'

import { localStorage } from '@/api/storage'
import auth from '@/api/auth'
import session from '@/api/session'
import user from '@/api/user'
import project from '@/api/project'
import userStories from '@/api/userStories'
import game from '@/api/game'

const instance = axios.create({
  baseURL: window.__env ? window.__env.TAIGA_API : ''
})

instance.defaults.headers.common['Content-Type'] = 'application/json'
instance.defaults.headers.common['Accept'] = 'application/json'
instance.defaults.headers.common['X-Session-id'] = session.get()

instance.interceptors.response.use(
  undefined,
  err => {
    if (err.response.status === 401) {
      localStorage.clear()
    }

    return Promise.reject(err.response.status)
  }
)

const setToken = token => {
  instance.defaults.headers.common['Authorization'] = `Application ${token}`
}

const userService = user(instance)
const authService = auth(instance, setToken)
const projectService = project(instance)
const userStoriesService = userStories(instance)
const gameService = game(instance)

// Load token at first time, if user has it in storage
const TOKEN = authService.token.get()
if (TOKEN) {
  setToken(TOKEN)
}

export {
  userService,
  authService,
  projectService,
  userStoriesService,
  gameService
}
