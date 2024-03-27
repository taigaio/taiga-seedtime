/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import store from '@/store'

export default router => {
  // Check if user is logged or authenticate when need it
  router.beforeEach((to, from, next) => {
    const REQUIRE_AUTH = to.matched.some(record => record.meta.requireAuth)

    if (REQUIRE_AUTH) {
      return store.dispatch('user/setMe')
        .then(next)
        .catch(() => next({
          path: '/',
          query: { next: window.location.pathname }
        }))
    }
    return next()
  })
  router.beforeResolve((to, from, next) => {
    const setupPages = [
      'setupGameData',
      'setupSelectUserStories',
      'setupGameReview'
    ]
    if (setupPages.includes(to.name)) {
      if (!store.state.game.projectData.slug) {
        return next({
          name: 'setupSelectProject'
        })
      }
    }
    return next()
  })
}
