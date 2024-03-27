/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import Vue from 'vue'
import _shuffle from 'lodash.shuffle'
import _cloneDeep from 'lodash.clonedeep'
import _differenceBy from 'lodash.differenceby'
import { gameService, projectService, userStoriesService } from '@/api'
import * as types from '@/store/mutation-types'
import router from '@/router'

const state = {
  projectDefaultImages: {
    images: [
      'project-logo-01.png',
      'project-logo-02.png',
      'project-logo-03.png',
      'project-logo-04.png',
      'project-logo-05.png'
    ],
    colors: [
      'rgba( 153,  214, 220, 1 )',
      'rgba( 213,  156,  156, 1 )',
      'rgba( 214, 161, 212, 1 )',
      'rgba( 164, 162, 219, 1 )',
      'rgba( 152, 224, 168, 1 )'
    ]
  },
  projectData: {},
  name: undefined,
  scale: [],
  scaleType: 'tshirts',
  points: [],
  roles: [],
  userStories: [],
  unselectedUS: [],
  isSelectAllUs: false,
  isBacklogActivated: false,
  isMilestone: false,
  isDiscard: false,
  tagsSelected: [],
  statusesSelected: [],
  id: undefined,
  uuid: undefined,
  gameUs: {},
  deck: [],
  discard: [],
  notNow: [],
  showRules: false,
  zoomIn: false,
  isUsEstimated: false,
  gameFinished: false
}

const getters = {
  getUserStory: state => (id = state.deck[0].id) => state.gameUs[id],
  getCurrentCard: state => {
    if (!state.deck.length) {
      return undefined
    }

    return state.deck[0]
  },
  getTotalPlaced: state => {
    return state.scale.reduce(
      (acc, item) => {
        if (item.cards) {
          acc = acc + item.cards.length
        }
        return acc
      },
      0
    )
  },
  totalGameUserStories: (state, getters) => {
    const totalDeck = state.deck.length || 0
    return getters.getTotalPlaced + totalDeck
  },
  getProjectDefaultImage: (state) => {
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))))
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a)
    return cartesian(state.projectDefaultImages.colors, state.projectDefaultImages.images)
  }
}

const actions = {
  // Project setup
  getProjectDetails ({ state }) {
    return projectService.projectDetail(state.projectData.slug)
  },
  getProjectList ({ dispatch }, userId) {
    return projectService.projectList(userId)
  },
  getProjectMilestoneUs ({ state }, { id, isGame = false }) {
    let usList = []
    if (isGame) {
      usList = state.deck.flatMap(us => us.id)
    }
    return projectService.projectMilestones(id, usList)
  },
  getUserStoriesFilters ({ state }, { projectId, milestone }) {
    return userStoriesService.userStoriesFilters(projectId, milestone)
  },

  // Game Actions
  async createGame ({ commit, state, dispatch }) {
    try {
      if (state.isSelectAllUs) {
        let uslist = await dispatch('getListUserStories', {
          fulldata: false,
          page: 1,
          tagsSelected: state.tagsSelected,
          statusesSelected: state.statusesSelected,
          milestone: state.isMilestone,
          pagination: false
        })

        let usSelected = []
        uslist.items.map(item => {
          let clean = false
          if (state.unselectedUS.length) {
            clean = state.unselectedUS.some(unselectedItem => unselectedItem === item.id)
          }
          if (!clean) {
            usSelected.push({id: item.id})
          }
        })
        commit(types.SET_USER_STORIES, usSelected)
      }
    } catch (error) {
      if (error === 401) {
        router.push({ name: 'login' })
      }
      throw error
    }

    if (state.uuid) {
      return gameService.update(
        state.uuid,
        {
          ...state,
          roles: state.roles.map(item => item.id)
        }
      )
    } else {
      return gameService.save({
        ...state,
        roles: state.roles.map(item => item.id)
      })
    }
  },
  async getGame ({ commit }, { projectSlug = undefined, gameUUID = undefined, reset = false }) {
    if (!projectSlug || !gameUUID) {
      console.error('You need project slug and game uuid to access')
      router.push({name: 'login'})
    }
    try {
      const game = await gameService.get(gameUUID)
      const project = await projectService.projectDetail(projectSlug)

      if (reset) {
        commit(types.RESET_GAME)
      }
      commit(types.SET_GAME_ID, game.id)
      commit(types.SET_GAME_UUID, game.uuid)
      commit(types.SET_PROJECT_DATA, {
        id: game.project,
        name: project.name,
        slug: project.slug,
        permissions: project.my_permissions,
        isBacklogActivated: project.is_backlog_activated,
        clear: false
      })
      commit(types.SET_NAME, game.name)
      commit(types.SET_SCALES, game.scales)
      commit(types.SET_POINTS, project.points)
      commit(
        types.SET_ROLES,
        game.roles.map(item => project.roles.find(orig => orig.id === item))
      )
      commit(types.SET_DECK, game.userstories)
      commit(types.SET_DISCARD, game.discard)
      commit(types.SET_NOT_NOW, game.notNow)
    } catch (error) {
      if (error === 401) {
        router.push({ name: 'login' })
      }
      throw error
    }
  },

  async updateGame ({ commit, dispatch }, { gameUUID = undefined }) {
    try {
      const game = await gameService.get(gameUUID)

      commit(types.SET_SCALES, game.scales)
      commit(types.SET_DECK, game.userstories)

      await dispatch('generateUserStories')

      commit(types.FILL_SCALES_WITH_USER_STORIES)
    } catch (error) {
      if (error === 401) {
        router.push({ name: 'login' })
      }
      throw error
    }
  },

  // Deck Actions
  shuffle ({ commit, state, dispatch }) {
    commit(
      types.SET_DECK,
      _shuffle(state.deck)
    )

    return dispatch('createFullDeck')
  },
  notNow ({ commit, state, dispatch }) {
    const US_TO_CHANGE = _cloneDeep(state.deck)
    US_TO_CHANGE.push(US_TO_CHANGE.shift())

    commit(
      types.SET_DECK,
      US_TO_CHANGE
    )

    return dispatch('createFullDeck')
  },
  discard ({ commit, state, dispatch }, userStoryId) {
    let discartedCard = []
    let discartedCardScale = state.scale.find(column => {
      return column.cards.find((item, index) => {
        if (item.id === userStoryId) {
          discartedCard[index] = item
          return item
        }
        return false
      })
    })

    let remainsDeck = state.deck.filter(item => item.id !== userStoryId)

    commit(
      types.SET_DECK,
      remainsDeck
    )
    if (discartedCard.length > 0) {
      commit(types.REMOVE_CARD_SCALE, {
        fromScale: discartedCardScale,
        toScale: '',
        cards: discartedCard
      })
    }

    const newDiscard = _cloneDeep(state.discard)
    newDiscard.push(userStoryId)
    commit(types.SET_DISCARD, newDiscard)
    return dispatch('createFullDeck')
  },

  // Roles Actions
  saveRolesOrdered ({ commit }, roles = undefined) {
    const SORTED_ROLES = roles.slice().sort((a, b) => (a.id - b.id || a.name.name.localeCompare(b.id)))
    commit(types.SET_ROLES, SORTED_ROLES)
  },
  setNewtPoint ({ commit, state, dispatch }, {userStoryId, roleId, pointId}) {
    let newPoint = {}
    newPoint[roleId] = pointId

    const POINTS = Object.assign(
      {},
      state.gameUs[userStoryId].points,
      newPoint
    )

    return dispatch(
      'updateUserStory',
      {
        id: userStoryId,
        values: {
          points: POINTS
        }
      }
    )
  },

  // Scale actions
  saveScalesOrdered ({ commit }, scales = undefined) {
    const SORTED_SCALES = scales.slice().sort((a, b) => a.order - b.order)
    commit(types.SET_SCALES, SORTED_SCALES)
  },

  fromDeck ({ commit, state, dispatch }, { toScale, selectedCardId }) {
    const SCALE_TO_MODIFY = state.scale.find(item => item.id === toScale)
    if (SCALE_TO_MODIFY) {
      commit(
        types.ADD_CARD_SCALE,
        {
          toScale: SCALE_TO_MODIFY,
          cards: SCALE_TO_MODIFY.cards,
          selectedCardId: selectedCardId
        }
      )

      return dispatch('createFullDeck')
    } else {
      return false
    }
  },
  betweenScales (
    { commit, state, dispatch }, { fromScale, toScale, selectedCardId }) {
    const SCALE_TO_REMOVE = state.scale.find(item => item.id === fromScale)
    const SCALE_TO_ADD = state.scale.find(item => item.id === toScale)

    if (SCALE_TO_REMOVE && SCALE_TO_ADD) {
      commit(types.REMOVE_CARD_SCALE, {
        fromScale: SCALE_TO_REMOVE,
        toScale: SCALE_TO_ADD,
        cards: SCALE_TO_ADD.cards,
        selectedCardId: selectedCardId
      })
      return dispatch('createFullDeck')
    } else {
      return false
    }
  },
  fromSearch ({ commit, state, dispatch }, { toScale, selectedCardId }) {
    const SCALE_TO_MODIFY = state.scale.find(item => item.id === toScale)
    if (SCALE_TO_MODIFY) {
      commit(
        types.ADD_CARD_SCALE,
        {
          toScale: SCALE_TO_MODIFY,
          cards: SCALE_TO_MODIFY.cards,
          selectedCardId: selectedCardId,
          fromSearch: true
        }
      )

      return dispatch('createFullDeck')
    } else {
      return false
    }
  },
  fromScales ({ commit, state, dispatch }, { fromScale, selectedCardId }) {
    const FROM_SCALE = state.scale.find(item => item.id === fromScale)
    if (FROM_SCALE) {
      const SCALE_CARDS = FROM_SCALE.cards.filter(card => card.id !== selectedCardId)
      commit(
        types.SET_CARDS_SCALE,
        {
          scale: FROM_SCALE,
          cards: SCALE_CARDS
        }
      )
      const NEW_DECK = _cloneDeep(state.deck)
      const NEW_CARD = state.deck.find(item => item.id === selectedCardId)
      if (!NEW_CARD) {
        NEW_DECK.unshift({
          id: selectedCardId,
          scale_id: undefined
        })
        commit(
          types.SET_DECK,
          NEW_DECK
        )
      }

      return dispatch('createFullDeck')
    } else {
      return false
    }
  },

  // User Stories Actions
  async createFullDeck ({ commit, state }) {
    try {
      let fullDeck = _cloneDeep(state.deck)
      fullDeck = state.scale.reduce(
        (acum, item) => {
          return acum.concat(item.cards)
        },
        fullDeck
      )

      const isEstimated = state.scale.find(item => item.cards.find(us => state.gameUs[us.id].estimates))
      commit(types.SET_ESTIMATION_US, Boolean(isEstimated))

      return await gameService.update(
        state.uuid,
        {
          userStories: fullDeck,
          discard: state.discard,
          notNow: state.notNow
        }
      )
    } catch (error) {
      if (error === 401) {
        router.push({ name: 'login' })
      }
      throw error
    }
  },

  async sendEstimationToTaiga ({ state, commit }) {
    try {
      await gameService.confirm(state.uuid)

      commit(types.SET_ESTIMATION_US, true)
    } catch (error) {
      if (error === 401) {
        router.push({ name: 'login' })
      }
      throw error
    }
  },

  updateDeck ({ commit, state, dispatch }, {userStories}) {
    let newDeck = _cloneDeep(state.deck)
    let newGameUs = _cloneDeep(state.gameUs)
    userStories.map(us => {
      newDeck.unshift({ id: us.id })
      newGameUs[us.id] = us
      return true
    })
    commit(types.SET_DECK, newDeck)
    commit(types.SET_GAME_USER_STORIES, newGameUs)

    let discardUs = userStories.flatMap(us => us.id)
    let newDiscard = state.discard.filter(us => !discardUs.includes(us))
    commit(types.SET_DISCARD, newDiscard)

    return dispatch('createFullDeck')
  },
  setNewBulkUs ({ commit, dispatch }, { stories = undefined }) {
    return userStoriesService.addBulkUs(state.projectData.id, stories)
      .then(userStories => {
        for (let userStory of userStories) {
          commit(types.ADD_NEW_GAME_USER_STORY, userStory)
        }
      })
      .then(() => dispatch('createFullDeck'))
      .catch(error => {
        if (error === 401) {
          router.push({ name: 'login' })
        }
        throw error
      })
  },
  async addExistingUs ({ state, commit, dispatch }) {
    try {
      if (state.isSelectAllUs) {
        let uslist = await dispatch('getListUserStories', {
          fulldata: false,
          page: 1,
          tagsSelected: state.tagsSelected,
          statusesSelected: state.statusesSelected,
          milestone: state.isMilestone,
          pagination: false,
          currentGame: true,
          discard: state.isDiscard
        })

        let usSelected = []
        uslist.items.map(item => {
          let clean = false
          if (state.unselectedUS.length) {
            clean = state.unselectedUS.some(unselectedItem => unselectedItem === item.id)
          }
          if (!clean) {
            usSelected[item.id] = item
          }
        })
        commit(types.SET_USER_STORIES, usSelected)
      } else {
        let usListIds = state.userStories.flatMap(us => us.id).toString()
        let uslist = await userStoriesService.userStoriesIds(usListIds, false)
        commit(types.SET_USER_STORIES, uslist)
      }

      let fullDeck = _cloneDeep(state.deck)
      let fullGameUs = _cloneDeep(state.gameUs)
      let discardFilter = _cloneDeep(state.discard)

      for (const us in state.userStories) {
        discardFilter = discardFilter.filter(id => {
          return id !== state.userStories[us].id
        })

        fullDeck.unshift({
          id: state.userStories[us].id,
          scale_id: undefined
        })

        if (!fullGameUs[state.userStories[us].id]) {
          fullGameUs[state.userStories[us].id] = state.userStories[us]
        }
      }

      commit(types.EDIT_GAME_USER_STORY_LIST, fullGameUs)
      commit(types.SET_DISCARD, discardFilter)
      commit(types.SET_DECK, fullDeck)

      dispatch('createFullDeck')
    } catch (error) {
      if (error === 401) {
        router.push({ name: 'login' })
      }
      throw error
    }
  },
  async createUserStory ({ commit, state, dispatch }, { title = undefined, description = undefined }) {
    try {
      const newUs = await userStoriesService.addUs(
        state.projectData.id,
        title,
        description
      )
      commit(types.ADD_NEW_GAME_USER_STORY, newUs)
      dispatch('createFullDeck')
    } catch (error) {
      if (error === 401) {
        router.push({name: 'login'})
      }
      throw error
    }
  },
  groupAllUserStories ({ state }) {
    const DECK_USER_STORIES = state.scale.reduce((acc, current) => {
      if (current.cards && current.cards.length) {
        return acc.concat(current.cards)
      }
      return acc
    }, [])

    return state.deck.concat(DECK_USER_STORIES)
  },
  async checkProjecttUserStories ({ state }, projectId) {
    try {
      let fulldata = false
      const list = await userStoriesService.userStoriesList(
        projectId,
        fulldata
      )
      if (Number(list.count) > 0) {
        return list.items
      }
      return false
    } catch (error) {
      if (error === 401) {
        router.push({name: 'login'})
      }
      throw error
    }
  },
  async getListUserStories ({ state }, {
    fulldata,
    page,
    tagsSelected,
    statusesSelected,
    milestone,
    pagination,
    currentGame = false,
    discard = false
  }) {
    try {
      if (currentGame) {
        return await userStoriesService.addUsToGame(
          state.uuid,
          fulldata,
          page,
          tagsSelected,
          statusesSelected,
          milestone,
          pagination,
          discard
        )
      } else {
        return await userStoriesService.userStoriesList(
          state.projectData.id,
          fulldata,
          page,
          tagsSelected,
          statusesSelected,
          milestone,
          pagination
        )
      }
    } catch (error) {
      if (error === 401) {
        router.push({name: 'login'})
      }
      throw error
    }
  },
  async generateUserStories ({ commit, state }) {
    try {
      let usList = state.deck.flatMap(us => us.id).toString()
      let gameUs = await userStoriesService.userStoriesIds(usList, false)
      commit(types.SET_GAME_USER_STORIES,
        gameUs.reduce((accum, current) => {
          accum[current.id] = current
          return accum
        }, {})
      )
    } catch (error) {
      if (error === 401) {
        router.push({name: 'login'})
      }
      throw error
    }
  },
  async refreshUserStory ({ commit }, id) {
    try {
      const update = await userStoriesService.userStoriesIds(id.toString(), false)
      commit(types.EDIT_GAME_USER_STORY, update[0])
      return update[0]
    } catch (error) {
      if (error === 401) {
        router.push({name: 'login'})
      }
      throw error
    }
  },
  async getUserStories ({ commit }, ids) {
    try {
      return await userStoriesService.userStoriesIds(ids.flatMap(us => us).toString(), false)
    } catch (error) {
      if (error === 401) {
        router.push({name: 'login'})
      }
      throw error
    }
  },
  async updateUserStory ({ commit, state }, { id, values }) {
    try {
      const update = await userStoriesService.usUpdate(id, values, state.gameUs[id].version)
      commit(types.EDIT_GAME_USER_STORY, update)
      return update
    } catch (error) {
      if (error === 401) {
        router.push({name: 'login'})
      }
      throw error
    }
  }
}

const mutations = {
  // Game Mutations
  [types.RESET_GAME] (state) {
    state.id = undefined
    state.uuid = undefined
    state.projectData = {}
    state.name = undefined
    state.scale = []
    state.roles = []
    state.userStories = []
    state.unselectedUS = []
    state.gameUs = []
    state.isMilestone = false
    state.isDiscard = false
    state.tagsSelected = []
    state.statusesSelected = []
  },
  [types.SET_GAME_ID] (state, gameID) {
    state.id = gameID
  },
  [types.SET_GAME_UUID] (state, gameUUID) {
    state.uuid = gameUUID
  },
  [types.SET_PROJECT_DATA] (state, { id, name, slug, permissions, isBacklogActivated, clear = true }) {
    if (clear) {
      // Reset project
      state.id = undefined
      state.uuid = undefined
      state.projectData = {}
      state.name = undefined
      state.scale = []
      state.roles = []
      state.userStories = []
      state.gameUs = []
    }

    state.projectData = {
      id,
      name,
      slug,
      permissions
    }
    state.isBacklogActivated = isBacklogActivated
  },
  [types.SET_NAME] (state, name) {
    state.name = name
  },
  [types.SET_POINTS] (state, points) {
    state.points = points
  },

  // Roles Mutations
  [types.SET_ROLES] (state, roles) {
    state.roles = roles
  },

  // Scale Mutations
  [types.SET_SCALES] (state, scale) {
    state.scale = scale
  },
  // ScaleType Mutations
  [types.SET_SCALE_TYPE] (state, scaleType) {
    state.scaleType = scaleType
  },

  [types.FILL_SCALES_WITH_USER_STORIES] (state) {
    let cards
    let newDeck = _cloneDeep(state.deck)

    state.scale = state.scale.map(scale => {
      cards = state.deck.filter(item => item.scale_id === scale.id)
      newDeck = _differenceBy(newDeck, cards, 'id')

      return {
        ...scale,
        cards
      }
    })

    state.deck = newDeck

    const isEstimated = state.scale.find(item => {
      if (item.cards.length) {
        return item.cards.find(us => state.gameUs[us.id].estimates)
      }
      return false
    })
    state.isUsEstimated = Boolean(isEstimated)
  },
  [types.ADD_CARD_SCALE] (state, { toScale = {}, cards, selectedCardId, fromSearch = false }) {
    toScale.cards.unshift({
      id: selectedCardId,
      scale_id: toScale.id
    })

    Vue.set(toScale, 'cards', cards)

    if (fromSearch) {
      state.deck = _differenceBy(state.deck, cards, 'id')
      return true
    }

    state.deck.shift()
    return true
  },
  [types.REMOVE_CARD_SCALE] (state, { fromScale = {}, toScale = {}, cards, selectedCardId }) {
    if (toScale) {
      if (selectedCardId) {
        toScale.cards.unshift({
          id: selectedCardId,
          scale_id: toScale.id
        })
      }
      Vue.set(toScale, 'cards', cards)
    }

    Vue.set(fromScale, 'cards', _differenceBy(fromScale.cards, cards, 'id'))
  },
  [types.SET_CARDS_SCALE] (state, { scale = {}, cards }) {
    Vue.set(scale, 'cards', cards)
  },

  // User Stories Mutations
  [types.SET_USER_STORIES] (state, userStories) {
    state.userStories = userStories
  },
  [types.SET_GAME_USER_STORIES] (state, userStories) {
    state.gameUs = userStories
  },
  [types.SET_DECK] (state, userStories) {
    state.deck = userStories
  },
  [types.SET_DISCARD] (state, userStories) {
    state.discard = userStories
  },
  [types.SET_NOT_NOW] (state, userStories) {
    state.notNow = userStories
  },
  [types.ADD_NEW_GAME_USER_STORY] (state, userStory) {
    Vue.set(state.gameUs, userStory.id, userStory)
    state.deck.unshift({
      id: userStory.id,
      scale_id: undefined
    })
  },
  [types.EDIT_GAME_USER_STORY] (state, userStory) {
    Vue.set(state.gameUs, userStory.id, userStory)
  },
  [types.EDIT_GAME_USER_STORY_LIST] (state, userStory) {
    state.gameUs = userStory
  },
  [types.SAVE_BACKLOG] (state, isBacklogActivated) {
    state.isBacklogActivated = isBacklogActivated
  },
  [types.SET_SHOW_RULES] (state, isShowRules) {
    state.showRules = isShowRules
  },
  [types.SET_SELECT_ALL_US] (state, selectAllUs) {
    state.isSelectAllUs = selectAllUs
  },
  [types.SET_MILESTONE] (state, milestone) {
    state.isMilestone = milestone
  },
  [types.SET_DISCARD_SELECTED] (state, isDiscard) {
    state.isDiscard = isDiscard
  },
  [types.SET_TAGS_SELECTED] (state, tagsSelected) {
    state.tagsSelected = tagsSelected
  },
  [types.SET_STATUSES_SELECTED] (state, statusesSelected) {
    state.statusesSelected = statusesSelected
  },
  [types.SET_UNSELECTED_US] (state, unselectedUS) {
    state.unselectedUS = unselectedUS
  },
  [types.TOGGLE_ZOOM] (state) {
    state.zoomIn = !state.zoomIn
  },
  [types.SET_ESTIMATION_US] (state, estimated) {
    state.isUsEstimated = estimated
  },
  [types.SET_FINISHED_GAME] (state, isFinished) {
    state.gameFinished = isFinished
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
