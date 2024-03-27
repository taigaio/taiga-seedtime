/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import game from '@/store/modules/game'

describe('Vuex Game Mutations', () => {
  it('RESET_GAME data', () => {
    const cleanState = {
      id: undefined,
      uuid: undefined,
      projectData: {},
      name: undefined,
      scale: [],
      roles: [],
      userStories: [],
      gameUs: []
    }
    game.state = {
      id: 1,
      uuid: '00001',
      projectData: {},
      name: 'test',
      scale: [],
      roles: [],
      userStories: [],
      gameUs: []
    }

    expect(game.state).not.toEqual(cleanState)

    game.mutations.RESET_GAME(game.state)

    expect(game.state).toEqual(cleanState)
  })

  it('SET_GAME_ID', () => {
    game.state.id = undefined
    expect(game.state.id).toBe(undefined)

    game.mutations.SET_GAME_ID(game.state, 2)
    expect(game.state.id).toBe(2)
  })

  it('SET_GAME_UUID', () => {
    game.state.uuid = undefined
    expect(game.state.uuid).toBe(undefined)

    game.mutations.SET_GAME_UUID(game.state, '00002')
    expect(game.state.uuid).toBe('00002')
  })

  it('SET_PROJECT_DATA without no reset', () => {
    const cleanState = {
      id: undefined,
      name: undefined,
      slug: undefined,
      permissions: {}
    }

    game.state.projectData = {
      id: undefined,
      name: undefined,
      slug: undefined,
      permissions: {}
    }
    expect(game.state.projectData).toEqual(cleanState)

    const params = {
      id: 3,
      name: 'test data',
      slug: 'test_data',
      permissions: {}
    }
    game.mutations.SET_PROJECT_DATA(game.state, { ...params, clear: false })
    expect(game.state.projectData).toEqual(params)
  })

  it('SET_PROJECT_DATA with reset', () => {
    const cleanState = {
      id: undefined,
      name: undefined,
      slug: undefined,
      permissions: {}
    }

    game.state.projectData = {
      id: 3,
      name: 'test data3',
      slug: 'test_data3',
      permissions: {}
    }
    expect(game.state.projectData).not.toEqual(cleanState)

    const params = {
      id: 4,
      slug: 'test_data4',
      permissions: {}
    }
    game.mutations.SET_PROJECT_DATA(game.state, params)
    expect(game.state.projectData).toEqual({ ...params, name: undefined })
  })

  it('SET_NAME', () => {
    game.state.name = undefined
    expect(game.state.name).toBe(undefined)

    game.mutations.SET_NAME(game.state, 'tests_name')
    expect(game.state.name).toBe('tests_name')
  })

  it('SET_POINTS', () => {
    game.state.points = []
    expect(game.state.points).toEqual([])

    const points = [{id: 2, name: 's', order: 0}, {id: 3, name: 'm', order: 1}]

    game.mutations.SET_POINTS(game.state, points)
    expect(game.state.points).toBe(points)
  })

  it('SET_ROLES', () => {
    game.state.roles = []
    expect(game.state.roles).toEqual([])

    const roles = [{id: 2, name: 'UX'}, {id: 5, name: 'FRONT'}]

    game.mutations.SET_ROLES(game.state, roles)
    expect(game.state.roles).toBe(roles)
  })

  it('SET_SCALES', () => {
    game.state.scale = []
    expect(game.state.scale).toEqual([])

    const scale = [{id: 2, name: 's', order: 0}, {id: 3, name: 'm', order: 1}]

    game.mutations.SET_SCALES(game.state, scale)
    expect(game.state.scale).toBe(scale)
  })

  it('SET_SCALE_TYPE', () => {
    game.state.scaleType = 'taiga'
    expect(game.state.scaleType).toBe('taiga')

    game.mutations.SET_SCALE_TYPE(game.state, 'tests_scaleType')
    expect(game.state.scaleType).toBe('tests_scaleType')
  })

  it('FILL_SCALES_WITH_USER_STORIES', () => {
    game.state.deck = [{
      id: 94,
      scale_id: 37
    }]
    game.state.scale = [{
      id: 37,
      name: '?',
      order: 1
    }]
    game.state.gameUs = {
      '37': {
        estimates: {}
      },
      '94': {
        estimates: {}
      }
    }

    const scaleUs = [{
      id: 37,
      name: '?',
      order: 1,
      cards: [{
        id: 94,
        scale_id: 37
      }]
    }]

    game.mutations.FILL_SCALES_WITH_USER_STORIES(game.state)
    expect(game.state.scale).toMatchObject(scaleUs)
  })

  describe('ADD_CARD_SCALE', () => {
    it('ADD_CARD_SCALE from deck', () => {
      game.state.deck = [
        {
          id: 77
        },
        {
          id: 78
        }
      ]

      expect(game.state.deck).toEqual([{id: 77}, {id: 78}])

      const toScale = {
        id: 27,
        name: '1/2',
        order: 3,
        cards: []
      }
      const cards = [
        {
          id: 77,
          scale_id: 27
        }
      ]
      game.mutations.ADD_CARD_SCALE(game.state, { toScale, cards })
      expect(toScale).toEqual(expect.objectContaining({ cards }))
      expect(game.state.deck).toEqual([{id: 78}])
    })

    it('ADD_CARD_SCALE from search', () => {
      game.state.deck = [
        {
          id: 77
        },
        {
          id: 78
        },
        {
          id: 79
        }
      ]

      expect(game.state.deck).toEqual([{id: 77}, {id: 78}, {id: 79}])

      const toScale = {
        id: 27,
        name: '1/2',
        order: 3,
        cards: []
      }
      const cards = [
        {
          id: 78,
          scale_id: 27
        }
      ]
      game.mutations.ADD_CARD_SCALE(game.state, { toScale, cards, fromSearch: true })
      expect(toScale).toEqual(expect.objectContaining({ cards }))
      expect(game.state.deck).toEqual([{id: 77}, {id: 79}])
    })
  })

  describe('REMOVE_CARD_SCALE', () => {
    it('move card between scales', () => {
      const fromScale = {
        id: 38,
        name: '0',
        order: 2,
        cards: [
          {
            id: 97,
            scale_id: 39
          }
        ]
      }
      const toScale = {
        id: 39,
        name: '1/2',
        order: 3,
        cards: []
      }
      const cards = [
        {
          id: 97,
          scale_id: 39
        }
      ]
      game.mutations.REMOVE_CARD_SCALE(game.state, { fromScale, toScale, cards })
      expect(fromScale).toEqual(expect.not.objectContaining({ cards }))
      expect(toScale).toEqual(expect.objectContaining({ cards }))
    })

    it('Discard card in scale', () => {
      const fromScale = {
        id: 38,
        name: '0',
        order: 2,
        cards: [
          {
            id: 97,
            scale_id: 39
          }
        ]
      }
      const toScale = ''
      const cards = [
        {
          id: 97,
          scale_id: 39
        }
      ]
      game.mutations.REMOVE_CARD_SCALE(game.state, { fromScale, toScale, cards })
      expect(fromScale).toEqual(expect.not.objectContaining({ cards }))
    })
  })

  it('SET_CARDS_SCALE', () => {
    const scale = {
      id: 38,
      name: '0',
      order: 2,
      cards: []
    }
    const cards = [
      {
        id: 94,
        scale_id: 38
      }, {
        id: 96,
        scale_id: 38
      }
    ]
    game.mutations.SET_CARDS_SCALE(game.state, { scale, cards })
    expect(scale).toEqual(expect.objectContaining({ cards }))
  })

  it('SET_USER_STORIES', () => {
    game.state.userStories = []
    expect(game.state.userStories).toEqual([])

    const userStories = [
      {id: 67},
      {id: 68},
      {id: 69},
      {id: 70}
    ]
    game.mutations.SET_USER_STORIES(game.state, userStories)
    expect(game.state.userStories).toEqual(userStories)
  })

  it('SET_DECK', () => {
    game.state.deck = []
    expect(game.state.deck).toEqual([])

    const userStories = [
      {id: 67},
      {id: 68},
      {id: 69},
      {id: 70}
    ]
    game.mutations.SET_DECK(game.state, userStories)
    expect(game.state.deck).toEqual(userStories)
  })

  it('ADD_NEW_GAME_USER_STORY', () => {
    game.state.gameUs = []
    game.state.deck = []

    const userStory = {
      id: 160,
      ref: 146,
      subject: 'dfgfdg',
      tags: [],
      description_html: '<p>cvbvcb</p>',
      is_blocked: false,
      attachments: [],
      points: {
        7: 13,
        8: 13,
        9: 13
      },
      total_points: null,
      project: 2
    }

    game.mutations.ADD_NEW_GAME_USER_STORY(game.state, userStory)
    expect(game.state.gameUs).toContain(userStory)
  })

  it('EDIT_USER_STORIES', () => {
    game.state.userStories = []
    expect(game.state.userStories).toEqual([])

    const userStories = [
      {id: 67},
      {id: 68},
      {id: 69},
      {id: 70}
    ]
    game.mutations.SET_USER_STORIES(game.state, userStories)
    expect(game.state.userStories).toEqual(userStories)
  })

  it('SAVE_BACKLOG', () => {
    const isBacklogActivated = true
    game.mutations.SAVE_BACKLOG(game.state, isBacklogActivated)
    expect(game.state.isBacklogActivated).toEqual(isBacklogActivated)
  })

  it('SET_SHOW_RULES', () => {
    const isShowRules = true
    game.mutations.SET_SHOW_RULES(game.state, isShowRules)
    expect(game.state.showRules).toEqual(isShowRules)
  })
})
