/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'
import TgEstimationFeedback from '@/components/TgEstimationFeedback/TgEstimationFeedback'

const getStore = () => {
  return new Store({
    state: {
      game: {
        scale: [
          {
            id: 1,
            name: 'S',
            order: 2,
            cards: []
          },
          {
            id: 2,
            name: 'M',
            order: 3,
            cards: []
          },
          {
            id: 3,
            name: 'L',
            order: 4,
            cards: []
          }
        ]
      }
    }
  })
}

const propsData = {
  place: ''
}

const store = getStore()

afterEach(() => store.reset())

const getWrapper = (...params) => {
  return mount(
    TgEstimationFeedback,
    ...params
  )
}

describe('TgEstimationFeedback', () => {
  describe('check visibility', () => {
    it('none props', () => {
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="summary"]')).toBe(false)
      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
    })

    it('summary', () => {
      propsData.place = 'summary'
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
    })
  })

  describe('board feedback', () => {
    it('small', () => {
      propsData.place = 'board'
      store.state.game.scale[0].cards = [{ id: 77, scale_id: 1 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="summary"]')).toBe(false)
      expect(wrapper.contains('[data-test="boardModal"]')).toBe(true)
      expect(wrapper.find('[data-test="boardModal"]').classes('task_small')).toBe(true)
    })

    it('medium', () => {
      propsData.place = 'board'
      store.state.game.scale[1].cards = [{ id: 77, scale_id: 2 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="summary"]')).toBe(false)
      expect(wrapper.contains('[data-test="boardModal"]')).toBe(true)
      expect(wrapper.find('[data-test="boardModal"]').classes('task_medium')).toBe(true)
    })

    it('big', () => {
      propsData.place = 'board'
      store.state.game.scale[2].cards = [{ id: 77, scale_id: 3 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="summary"]')).toBe(false)
      expect(wrapper.contains('[data-test="boardModal"]')).toBe(true)
      expect(wrapper.find('[data-test="boardModal"]').classes('task_big')).toBe(true)
    })
  })

  describe('board close button', () => {
    it('close modal', () => {
      propsData.place = 'board'
      store.state.game.scale[2].cards = [{ id: 77, scale_id: 3 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(true)

      wrapper.find('[data-test="closeBoardModal"]').trigger('click')

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
    })
  })

  describe('summary feedback', () => {
    it('small', () => {
      propsData.place = 'summary'
      store.state.game.scale[0].cards = [{ id: 77, scale_id: 1 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="summarySmall"]')).toBe(true)
    })

    it('medium', () => {
      propsData.place = 'summary'
      store.state.game.scale[1].cards = [{ id: 77, scale_id: 2 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="summaryMedium"]')).toBe(true)
    })

    it('big', () => {
      propsData.place = 'summary'
      store.state.game.scale[2].cards = [{ id: 77, scale_id: 3 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="summaryBig"]')).toBe(true)
    })

    it('smallMedium', () => {
      propsData.place = 'summary'
      store.state.game.scale[0].cards = [{ id: 77, scale_id: 1 }, { id: 78, scale_id: 1 }]
      store.state.game.scale[1].cards = [{ id: 79, scale_id: 2 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="summarySmallMedium"]')).toBe(true)
    })

    it('smallBig', () => {
      propsData.place = 'summary'
      store.state.game.scale[0].cards = [{ id: 77, scale_id: 1 }, { id: 78, scale_id: 1 }, { id: 79, scale_id: 1 }]
      store.state.game.scale[2].cards = [{ id: 80, scale_id: 3 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="summarySmallBig"]')).toBe(true)
    })

    it('mediumBig', () => {
      propsData.place = 'summary'
      store.state.game.scale[1].cards = [{ id: 77, scale_id: 2 }, { id: 78, scale_id: 2 }]
      store.state.game.scale[2].cards = [{ id: 80, scale_id: 3 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="summaryMediumBig"]')).toBe(true)
    })

    it('equilibrate', () => {
      propsData.place = 'summary'
      store.state.game.scale[0].cards = [{ id: 77, scale_id: 1 }, { id: 78, scale_id: 1 }, { id: 79, scale_id: 1 }]
      store.state.game.scale[1].cards = [{ id: 80, scale_id: 2 }, { id: 81, scale_id: 2 }]
      store.state.game.scale[2].cards = [{ id: 82, scale_id: 3 }]
      const wrapper = getWrapper({
        mocks: { $store: store },
        propsData
      })

      expect(wrapper.contains('[data-test="boardModal"]')).toBe(false)
      expect(wrapper.contains('[data-test="summary"]')).toBe(true)
      expect(wrapper.contains('[data-test="summaryEquilibrate"]')).toBe(true)
    })
  })
})
