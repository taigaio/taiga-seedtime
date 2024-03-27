/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import TgGameNavigation from '@/components/TgGameNavigation/TgGameNavigation'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'

const getStore = () => {
  return new Store({
    state: {
      game: {
        projectData: {
          id: 3,
          name: 'Project Example 2',
          slug: 'project-2',
          permissions: []
        },
        getGameUUID: '03862d29c1c4485285881dc5c7f898fc'
      }
    }
  })
}

const getWrapper = (...params) => {
  return shallowMount(
    TgGameNavigation,
    ...params
  )
}
const store = getStore()

describe('TgGameNavigation', () => {
  it('check visibility', () => {
    const wrapper = getWrapper({
      stubs: { RouterLink: RouterLinkStub },
      mocks: { $store: store }
    })

    expect(wrapper.contains('[data-test="linkGame"]')).toBe(true)
    expect(wrapper.contains('[data-test="linkSummary"]')).toBe(true)
  })
})

