/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import Vue from 'vue'

const DEFAULT_LANGUAGE = 'en'

const translationMixin = {
  install (Vue) {
    Vue.mixin({
      mounted () {
        const SELECTED_LANG = this.$translate.lang

        if (!this.$translate.locales[SELECTED_LANG]) {
          this.$translate.setLang(DEFAULT_LANGUAGE)
        }
      }
    })
  }
}

Vue.use(translationMixin)
