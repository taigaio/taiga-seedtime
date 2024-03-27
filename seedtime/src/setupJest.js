/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import Vue from 'vue'

import VueTestUtils from '@vue/test-utils'
import translations from '@/translations/translations.js'

const locale = 'en'

VueTestUtils.config.mocks.t = (msg) => translations[locale][msg]

Vue.config.productionTip = false
// App Constants
Vue.config.estimations = {}
