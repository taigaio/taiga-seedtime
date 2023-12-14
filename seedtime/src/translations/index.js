/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

// Dependencies
import Vue from 'vue'
import VueTranslate from 'vue-translate-plugin'

Vue.use(VueTranslate)

let USER_LANG = navigator.language || navigator.userLanguage

// filter multiple same language versions
export default USER_LANG.split('-')[0]
