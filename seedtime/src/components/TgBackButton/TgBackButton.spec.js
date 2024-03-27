/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import { shallowMount } from '@vue/test-utils'

import TgBackButton from '@/components/TgBackButton/TgBackButton.vue'

describe('TgBackButton', () => {
  it('render button component', () => {
    let wrapper = shallowMount(TgBackButton)
    expect(wrapper.contains('[data-test="tgButton"]')).toBe(true)
  })
})
