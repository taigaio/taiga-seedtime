/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'
import TgAddUs from '@/components/TgAddUs/TgAddUs'

// create the Store mock
const store = new Store({
  state: {
    game: {
      gameUs: {}
    }
  }
})
// add other mocks here so they are accessible in every component
const mocks = {
  $store: store
}

afterEach(() => store.reset())

describe('TgAddUs', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(TgAddUs, { mocks })
  })

  it('default tab add single', () => {
    expect(wrapper.find('[data-test="single"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="bulk"]').exists()).toBe(false)
  })

  it('toggle tab to add bulk', () => {
    expect(wrapper.find('[data-test="single"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="bulk"]').exists()).toBe(false)

    wrapper.find('[data-test="bulkButton"]').trigger('click')

    expect(wrapper.find('[data-test="single"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="bulk"]').exists()).toBe(true)
  })

  describe('single us form', () => {
    it('check single us form', () => {
      expect(wrapper.find('[data-test="single"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="submitSingle"]:disabled').exists()).toBe(true)

      wrapper.find('[data-test="singleTitle"]').setValue('new us')

      expect(wrapper.find('[data-test="submitSingle"]:disabled').exists()).toBe(false)
    })

    it('check single us submit', async () => {
      wrapper.find('[data-test="singleTitle"]').setValue('new us')
      wrapper.find('[data-test="submitSingle"]').trigger('submit')

      await store.dispatch('game/createUserStory')

      expect(store.dispatch).toHaveBeenCalledWith('game/createUserStory', {title: 'new us', description: undefined})
    })
  })

  describe('bulk us form', () => {
    beforeEach(() => {
      wrapper.find('[data-test="bulkButton"]').trigger('click')
    })

    it('check bulk us form', () => {
      expect(wrapper.find('[data-test="bulk"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="submitBulk"]:disabled').exists()).toBe(true)

      wrapper.find('[data-test="bulkTitles"]').setValue('one us')

      expect(wrapper.find('[data-test="submitBulk"]:disabled').exists()).toBe(false)
    })

    it('check bulk us submit', async () => {
      wrapper.find('[data-test="bulkTitles"]').setValue('one us')
      wrapper.find('[data-test="submitBulk"]').trigger('submit')

      await store.dispatch('game/setNewBulkUs')

      expect(store.dispatch).toHaveBeenCalledWith('game/setNewBulkUs', {stories: 'one us'})
    })
  })
})
