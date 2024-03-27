/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'

// Plugins
// import createLogger from 'vuex/dist/logger'

import user from '@/store/modules/user'
import step from '@/store/modules/step'
import modal from '@/store/modules/modal'
import search from '@/store/modules/search'
import game from '@/store/modules/game'

Vue.use(Vuex)

// Only strict in another environment different to production
const DEBUG = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    user,
    step,
    modal,
    search,
    game
  },
  strict: DEBUG
  // plugins: DEBUG ? [createLogger()] : []
})

export default store
