/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import Vue from 'vue'

Vue.directive('click-outside', {
  bind (el, binding, vnode) {
    el.event = event => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }

    document.body.addEventListener('click', el.event)
  },
  unbind (el) {
    document.body.removeEventListener('click', el.event)
  }
})
