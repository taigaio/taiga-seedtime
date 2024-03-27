/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

// Dependencies
import Vue from 'vue'
import userLang from '@/translations'
import '@/translations/mixin'

import router from '@/router'
import store from '@/store'
import '@/directives/focus'
import '@/directives/clickOutside'

// Components
import App from '@/App'

Vue.config.productionTip = false

Vue.config.estimations = {NODE_ENV: process.env.NODE_ENV, ...window.__env}

console.info('%c Language detected:', 'color: blue;font-weight:700;', userLang)

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  components: { App },
  template: '<App/>',
  mounted () {
    this.$translate.setLang(userLang)
  }
})
