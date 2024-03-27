/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import { mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'
import TgBoard from '@/containers/TgBoard/TgBoard'

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
        id: 74,
        uuid: '60cc6a26b4b94971aee55324f05fa777',
        scale: [
          {
            id: 25,
            name: '?',
            order: 1,
            cards: []
          }, {
            id: 26,
            name: '0',
            order: 2,
            cards: []
          }
        ],
        zoomIn: false
      }
    },
    getters: {
      'game/getTotalPlaced': 1
    }
  })
}

const getWrapper = (...params) => {
  return mount(
    TgBoard,
    ...params
  )
}

describe('TgBoard', () => {
  let store, wrapper

  describe('basic config', () => {
    beforeEach(async () => {
      store = getStore()

      wrapper = getWrapper({
        stubs: {
          TgUserStory: true,
          TgEvents: true
        },
        mocks: {
          $store: store
        }
      })
    })

    it('on create', () => {
      expect(wrapper.contains('[data-test="board"]')).toBe(true)
      expect(wrapper.contains('[data-test="tgEvents"]')).toBe(true)
      expect(wrapper.contains('[data-test="scales"]')).toBe(true)
      expect(wrapper.contains('[data-test="scale?"]')).toBe(true)
      expect(wrapper.contains('[data-test="scale0"]')).toBe(true)
      expect(wrapper.contains('[data-test="draggable"]')).toBe(true)
      expect(wrapper.contains('[data-test="emptyBoard"]')).toBe(false)
    })

    it('no data', () => {
      store.state.game.scale = []
      store.getters['game/getTotalPlaced'] = 0

      expect(wrapper.contains('[data-test="board"]')).toBe(true)
      expect(wrapper.contains('[data-test="tgEvents"]')).toBe(true)
      expect(wrapper.contains('[data-test="scales"]')).toBe(false)
      expect(wrapper.contains('[data-test="draggable"]')).toBe(false)
      expect(wrapper.contains('[data-test="emptyBoard"]')).toBe(true)
    })
  })

  describe('DOM changes', () => {
    beforeEach(async () => {
      store = getStore()

      wrapper = getWrapper({
        stubs: {
          TgUserStory: true,
          TgEvents: true
        },
        mocks: {
          $store: store
        }
      })
    })

    it('toggle emptyBoard img', () => {
      expect(wrapper.contains('[data-test="emptyBoard"]')).toBe(false)

      store.getters['game/getTotalPlaced'] = 0
      expect(wrapper.contains('[data-test="emptyBoard"]')).toBe(true)
    })

    it('toogle zoom', () => {
      expect(wrapper.find('[data-test="board"]').classes('zoom')).toBe(false)

      store.state.game.zoomIn = true
      expect(wrapper.find('[data-test="board"]').classes('zoom')).toBe(true)
    })
  })

  describe('dragme', () => {
    let betweenScales, fromDeck, fromSearch

    beforeEach(async () => {
      store = getStore()

      betweenScales = jest.fn()
      .mockReturnValue(true)
      fromDeck = jest.fn()
      .mockReturnValue(true)
      fromSearch = jest.fn()
      .mockReturnValue(true)

      wrapper = getWrapper({
        stubs: {
          TgUserStory: true,
          TgEvents: true
        },
        mocks: { $store: store },
        methods: {
          betweenScales,
          fromDeck,
          fromSearch
        }
      })
    })

    it('add us from deck to scale', async () => {
      let event = {
        from: {
          id: '',
          attributes: {
            'data-name': {
              nodeValue: 'deck'
            }
          }
        },
        to: {
          id: '26',
          attributes: {
            'data-name': {
              nodeValue: 'scale'
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

      expect(fromDeck).toHaveBeenCalledTimes(1)
    })

    it('add us from scale to scale', async () => {
      let event = {
        from: {
          id: '26',
          attributes: {
            'data-name': {
              nodeValue: 'scale'
            }
          }
        },
        to: {
          id: '25',
          attributes: {
            'data-name': {
              nodeValue: 'scale'
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

      expect(betweenScales).toHaveBeenCalledTimes(1)
    })

    it('add us from search to scale', async () => {
      let event = {
        from: {
          id: '',
          attributes: {
            'data-name': {
              nodeValue: 'search'
            }
          }
        },
        to: {
          id: '26',
          attributes: {
            'data-name': {
              nodeValue: 'scale'
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

      expect(fromSearch).toHaveBeenCalledTimes(1)
    })
  })

  describe('event message', () => {
    let refreshUserStory, updateGame

    beforeEach(async () => {
      store = getStore()

      updateGame = jest.fn()
      .mockReturnValue(true)
      refreshUserStory = jest.fn()
      .mockReturnValue(true)

      wrapper = getWrapper({
        stubs: {
          TgUserStory: true,
          TgEvents: true
        },
        mocks: { $store: store },
        methods: {
          refreshUserStory,
          updateGame
        }
      })
    })

    it('update game event', () => {
      const data = {
        pk: 74
      }
      const routingKey = wrapper.vm.eventsSubscriptionForGames
      wrapper.vm.processEventsMessage(routingKey, data)

      expect(updateGame).toHaveBeenCalledTimes(1)
    })

    it('none update game event with wrong game id', () => {
      const data = {
        pk: 75
      }
      const routingKey = wrapper.vm.eventsSubscriptionForGames
      wrapper.vm.processEventsMessage(routingKey, data)

      expect(updateGame).toHaveBeenCalledTimes(0)
    })

    it('update userStory event', () => {
      const data = {
        pk: 74
      }
      const routingKey = wrapper.vm.eventsSubscriptionForUserStories
      wrapper.vm.processEventsMessage(routingKey, data)

      expect(refreshUserStory).toHaveBeenCalledTimes(1)
    })

    it('update userStory event even wrong game id', () => {
      const data = {
        pk: 75
      }
      const routingKey = wrapper.vm.eventsSubscriptionForUserStories
      wrapper.vm.processEventsMessage(routingKey, data)

      expect(refreshUserStory).toHaveBeenCalledTimes(1)
    })
  })
})

