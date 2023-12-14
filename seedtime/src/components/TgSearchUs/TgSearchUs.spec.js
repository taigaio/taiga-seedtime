/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import TgSearchUs from '@/components/TgSearchUs/TgSearchUs'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'

const getStore = () => {
  return new Store({
    state: {
      game: {
        deck: [
          {
            'id': 21,
            'scale_id': undefined
          },
          {
            'id': 22
          },
          {
            'id': 23
          }
        ]
      }
    },
    getters: {
      'game/getUserStory': jest.fn()
        .mockImplementation(id => {
          if (id === 21) {
            return {
              id: 21,
              ref: 21,
              subject: 'US new game',
              tags: [],
              'status_extra_info': {
                name: 'Nueva',
                color: '#999999',
                is_closed: false
              },
              'description_html': '<p>this is an example</p>',
              'is_blocked': false,
              points: {
                '1': 12,
                '2': 12,
                '3': 12,
                '4': 12
              },
              'total_points': 160,
              project: 1,
              version: 1,
              estimates: null
            }
          } else if (id === 22) {
            return {
              id: 22,
              ref: 22,
              subject: 'test',
              tags: [],
              'status_extra_info': {
                name: 'Nueva',
                color: '#999999',
                is_closed: false
              },
              'description_html': '<p>this is an example</p>',
              'is_blocked': false,
              points: {
                '1': 12,
                '2': 12,
                '3': 12,
                '4': 12
              },
              'total_points': 160,
              project: 1,
              version: 1,
              estimates: null
            }
          } else {
            return {
              id: 23,
              ref: 23,
              subject: 'US',
              tags: [],
              'status_extra_info': {
                name: 'Nueva',
                color: '#999999',
                is_closed: false
              },
              'description_html': '<p>this is an example</p>',
              'is_blocked': false,
              points: {
                '1': 12,
                '2': 12,
                '3': 12,
                '4': 12
              },
              'total_points': 160,
              project: 1,
              version: 1,
              estimates: null
            }
          }
        })
    }
  })
}

const getWrapper = (...params) => {
  return mount(
    TgSearchUs,
    ...params
  )
}

describe('TgSearchUs', () => {
  let store, wrapper, fromScales

  beforeEach(() => {
    store = getStore()

    fromScales = jest.fn()
      .mockReturnValue(true)

    wrapper = getWrapper({
      mocks: {
        $store: store
      },
      methods: {
        fromScales
      }
    })
  })

  describe('basic config', () => {
    it('load data', () => {
      expect(wrapper.contains('[data-test="closeButton"]')).toBe(true)
      expect(wrapper.contains('[data-test="filter"]')).toBe(true)
      expect(wrapper.contains('[data-test="userStoryList"]')).toBe(true)

      expect(wrapper.findAll('[data-test="userStoryList"]').length).toBe(3)
    })

    it('no data', () => {
      store.state.game.deck = []

      expect(wrapper.findAll('[data-test="userStoryList"]').length).toBe(0)
    })
  })

  describe('filters', () => {
    it('filter by name', () => {
      wrapper.setData({
        filterName: 'new'
      })

      expect(wrapper.findAll('[data-test="userStoryList"]').length).toBe(1)
    })

    it('filter by ref', () => {
      wrapper.setData({
        filterName: '22'
      })

      expect(wrapper.findAll('[data-test="userStoryList"]').length).toBe(1)
    })

    it('filter several results', () => {
      wrapper.setData({
        filterName: 'US'
      })

      expect(wrapper.findAll('[data-test="userStoryList"]').length).toBe(2)
    })
  })

  describe('us detail', () => {
    it('open us detail', () => {
      wrapper.find('[data-test="openDetailButton"]').trigger('click')

      expect(store.commit).toHaveBeenCalledWith('search/SET_CURRENT_US', 21)
      expect(store.commit).toHaveBeenCalledWith('modal/OPEN_MODAL', 'showUsDetail')
    })
  })

  describe('dragme', () => {
    it('add us to search from scales', async () => {
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
              nodeValue: 'search'
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

    it('add us to search from deck', async () => {
      let event = {
        from: {
          id: '12',
          attributes: {
            'data-name': {
              nodeValue: 'deck'
            }
          }
        },
        to: {
          id: '',
          attributes: {
            'data-name': {
              nodeValue: 'search'
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
