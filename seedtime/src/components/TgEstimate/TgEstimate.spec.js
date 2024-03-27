/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import TgEstimate from '@/components/TgEstimate/TgEstimate'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'

const getStore = () => {
  return new Store({
    state: {
      game: {
        scales: [],
        deck: [],
        projectData: {
          permissions: [
            'add_us'
          ]
        }
      }
    },
    getters: {
      'game/getCurrentCard': {
        id: 67
      }
    }
  })
}

const getWrapper = (...params) => {
  return mount(
    TgEstimate,
    ...params
  )
}

describe('TgEstimate', () => {
  let store, wrapper, fromScales

  beforeEach(() => {
    store = getStore()

    fromScales = jest.fn()
      .mockReturnValue(true)

    wrapper = getWrapper({
      stubs: {
        TgUserStory: true,
        TgUsFeedback: true,
        TgProgressBar: true
      },
      mocks: { $store: store },
      methods: {
        fromScales
      }
    })
  })

  it('check components and modals visibility', () => {
    expect(wrapper.contains('[data-test="progressBarComponent"]')).toBe(true)
    expect(wrapper.contains('[data-test="draggable"]')).toBe(true)
    expect(wrapper.contains('[data-test="userStoryComponent"]')).toBe(true)

    expect(wrapper.contains('[data-test="userStoryComponentEmpty"]')).toBe(false)
    expect(wrapper.contains('[data-test="disclamerModal"]')).toBe(false)
    expect(wrapper.contains('[data-test="addModal"]')).toBe(false)
  })

  it('check enabled button scenario', () => {
    expect(wrapper.find('[data-test="searchModalButton"]:disabled').exists()).toBe(false)
    expect(wrapper.find('[data-test="shuffleButton"]:disabled').exists()).toBe(false)
    expect(wrapper.find('[data-test="notNowButton"]:disabled').exists()).toBe(false)
    expect(wrapper.find('[data-test="discardButtonModal"]:disabled').exists()).toBe(false)

    store.state.game.projectData = { permissions: [] }
    expect(wrapper.find('[data-test="addButtonModal"]').exists()).toBe(false)

    expect(wrapper.contains('[data-test="userStoryComponent"]')).toBe(true)
    expect(wrapper.contains('[data-test="userStoryComponentEmpty"]')).toBe(false)
  })

  it('check disabled button scenario', () => {
    store.getters['game/getCurrentCard'] = undefined

    expect(wrapper.find('[data-test="searchModalButton"]:disabled').exists()).toBe(true)
    expect(wrapper.find('[data-test="shuffleButton"]:disabled').exists()).toBe(true)
    expect(wrapper.find('[data-test="notNowButton"]:disabled').exists()).toBe(true)
    expect(wrapper.find('[data-test="discardButtonModal"]:disabled').exists()).toBe(true)
    expect(wrapper.find('[data-test="addButtonModal"]').exists()).toBe(true)

    expect(wrapper.contains('[data-test="userStoryComponent"]')).toBe(false)
    expect(wrapper.contains('[data-test="userStoryComponentEmpty"]')).toBe(true)
  })

  it('open search modal', () => {
    wrapper.find('[data-test="searchModalButton"]').trigger('click')

    expect(store.commit).toHaveBeenCalledWith('modal/OPEN_MODAL', 'search')
  })

  it('suffle action', () => {
    wrapper.find('[data-test="shuffleButton"]').trigger('click')

    expect(store.dispatch).toHaveBeenCalledWith('game/shuffle')
  })

  it('not now action', () => {
    wrapper.find('[data-test="notNowButton"]').trigger('click')

    expect(store.dispatch).toHaveBeenCalledWith('game/notNow')
  })

  describe('discard us', () => {
    it('open discard modal', () => {
      expect(wrapper.contains('[data-test="disclamerModal"]')).toBe(false)

      wrapper.find('[data-test="discardButtonModal"]').trigger('click')

      expect(wrapper.contains('[data-test="disclamerModal"]')).toBe(true)
    })

    it('discard us', async () => {
      wrapper.setData({
        disclamerModal: true
      })

      expect(wrapper.contains('[data-test="disclamerModal"]')).toBe(true)

      wrapper.find('[data-test="discardButton"]').trigger('click')

      expect(store.dispatch).toHaveBeenCalledWith('game/discard', store.getters['game/getCurrentCard'].id)
      expect(wrapper.contains('[data-test="disclamerModal"]')).toBe(false)

      // const notifyText = 'NOTIFY_SUCCESS'
      // await expect(store.commit).toHaveBeenCalledWith('modal/NOTIFY_TEXT', {text: notifyText})

      // await expect(store.commit).toHaveBeenCalledWith('modal/OPEN_MODAL', 'notify')
    })

    it('cancel discard', () => {
      wrapper.setData({
        disclamerModal: true
      })

      expect(wrapper.contains('[data-test="disclamerModal"]')).toBe(true)

      wrapper.find('[data-test="cancelButton"]').trigger('click')

      expect(wrapper.contains('[data-test="disclamerModal"]')).toBe(false)
    })
  })

  describe('add us', () => {
    it('open add modal', () => {
      expect(wrapper.contains('[data-test="addModal"]')).toBe(false)

      wrapper.find('[data-test="addButtonModal"]').trigger('click')

      expect(wrapper.contains('[data-test="addModal"]')).toBe(true)
    })

    it('add new us', () => {
      wrapper.setData({
        addModal: true
      })

      expect(wrapper.contains('[data-test="addModal"]')).toBe(true)

      wrapper.find('[data-test="newButton"]').trigger('click')
      expect(store.commit).toHaveBeenCalledWith('modal/OPEN_MODAL', 'addUs')
    })

    it('add existing us', () => {
      wrapper.setData({
        addModal: true
      })

      expect(wrapper.contains('[data-test="addModal"]')).toBe(true)

      wrapper.find('[data-test="addButton"]').trigger('click')
      expect(store.commit).toHaveBeenCalledWith('modal/OPEN_MODAL', 'addExisting')
    })

    it('close add modal', () => {
      wrapper.setData({
        addModal: true
      })

      wrapper.find('[data-test="closeButton"]').trigger('click')

      expect(wrapper.contains('[data-test="addModal"]')).toBe(false)
    })
  })

  describe('dragme', () => {
    it('add us to deck from scales', async () => {
      let event = {
        from: {
          id: '12',
          attributes: {
            'data-name': {
              nodeValue: 'scale'
            }
          }
        },
        to: {
          id: '',
          attributes: {
            'data-name': {
              nodeValue: 'deck'
            }
          }
        },
        item: {
          attributes: {
            'data-card-id': {
              nodeValue: 'data-card-id'
            }
          }
        }
      }
      wrapper.vm.$emit('event', event)

      await wrapper.vm.onAdd(event)

      expect(fromScales).toHaveBeenCalledTimes(1)
    })

    it('add us to deck from search', async () => {
      let event = {
        from: {
          id: '12',
          attributes: {
            'data-name': {
              nodeValue: 'search'
            }
          }
        },
        to: {
          id: '',
          attributes: {
            'data-name': {
              nodeValue: 'deck'
            }
          }
        },
        item: {
          attributes: {
            'data-card-id': {
              nodeValue: 'data-card-id'
            }
          }
        }
      }
      wrapper.vm.$emit('event', event)

      await wrapper.vm.onAdd(event)

      expect(fromScales).toHaveBeenCalledTimes(0)
    })
  })
})
