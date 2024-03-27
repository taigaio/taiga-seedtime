/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

// import flushPromises from 'flush-promises'

import { projectService, userStoriesService } from '@/api'
import game from '@/store/modules/game'

describe('Vuex Game Actions', () => {
  it('getProjectList', () => {
    const projectList = jest.spyOn(projectService, 'projectList')

    const userId = 5
    const dispatch = jest.fn()
    game.actions.getProjectList({ dispatch }, userId)

    expect(projectList).toHaveBeenCalledWith(userId)
  })

  it('getProjectMilestoneUs', () => {
    // const projectMilestones = jest.spyOn(projectService, 'projectMilestones')

    // const id = 1
    // const state = jest.fn()
    // game.actions.getProjectMilestoneUs({ state }, { id })

    // expect(projectMilestones).toHaveBeenCalledWith(id)
  })

  it('getUserStoriesFilters', () => {
    const userStoriesFilters = jest.spyOn(userStoriesService, 'userStoriesFilters')

    const projectId = 1
    const milestone = false
    const state = jest.fn()
    game.actions.getUserStoriesFilters({ state }, { projectId, milestone })

    expect(userStoriesFilters).toHaveBeenCalledWith(projectId, milestone)
  })

  describe('create game', () => {
    it('createGame', async () => {
      // const roles = [7, 8, 9]
      // game.state.roles = [
      //   {
      //     id: 7,
      //     name: 'UX'
      //   }, {
      //     id: 8,
      //     name: 'Diseñador'
      //   }, {
      //     id: 9,
      //     name: 'Front'
      //   }
      // ]

      // let items

      // const state = game.state
      // const commit = jest.fn()
      // let mockDispatch = (state, payload) => {
      //   items = payload
      // }

      // gameService.save = jest.fn().mockResolvedValue({uuid: '0001'})

      // hay que mockear la acción!!!
      // let newGame = await game.actions.createGame({ commit, state, dispatch: mockDispatch })
      // console.log('newGame', newGame)

      // expect(commit).toHaveBeenCalledWith('SET_USER_STORIES', usSelected)
      // expect(commit).toHaveBeenCalledWith('SET_GAME_UUID', '0001')
    })
  })
})
