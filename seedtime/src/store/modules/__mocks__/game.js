/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const state = {
  id: undefined,
  uuid: undefined,
  projectData: {},
  name: undefined,
  scale: [],
  scaleType: 'taiga',
  points: [],
  roles: [],
  isBacklogActivated: false,
  deck: [],
  userStories: [],
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
  showRules: false
}
export const getters = {
  getUserStory: jest.fn().mockReturnValue([]),
  getCurrentCard: jest.fn().mockReturnValue([]),
  getTotalPlaced: jest.fn().mockReturnValue(10),
  totalGameUserStories: jest.fn().mockReturnValue(5),
  getProjectDefaultImage: jest.fn().mockReturnValue('sdfdsfdsf')
}
export const mutations = {}
export const actions = {}

export function __createMocks (custom = {
  getters: {},
  mutations: {},
  actions: {},
  state: {}
}) {
  const mockGetters = Object.assign({}, getters, custom.getters)
  const mockMutations = Object.assign({}, mutations, custom.mutations)
  const mockActions = Object.assign({}, actions, custom.actions)
  const mockState = Object.assign({}, state, custom.state)

  return {
    getters: mockGetters,
    mutations: mockMutations,
    actions: mockActions,
    state: mockState,
    store: new Vuex.Store({
      getters: mockGetters,
      mutations: mockMutations,
      actions: mockActions,
      state: mockState
    })
  }
}

export const store = __createMocks().store
