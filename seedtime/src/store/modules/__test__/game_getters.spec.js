/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import game from '@/store/modules/game'

describe('Vuex Game Getters', () => {
  beforeEach(() => {
    game.state.gameUs = [['first'], ['second']]
    game.state.deck = [{ id: 0 }]
  })

  describe('getUserStory', () => {
    it('Get default us', () => {
      const us = game.getters.getUserStory(game.state)()
      expect(us).toEqual(expect.arrayContaining(game.state.gameUs[0]))
    })

    it('Get asked us by id', () => {
      const id = 1
      const gameUs = [['first'], ['second']]
      const us = game.getters.getUserStory(game.state, { gameUs })(id)

      expect(us).toEqual(expect.arrayContaining(gameUs[id]))
    })
  })

  describe('getCurrentCard', () => {
    beforeEach(() => {
      game.state.userStories = [['first'], ['second']]
      game.state.deck = []
    })

    it('get undefined when there is no cards on deck', () => {
      const deck = game.getters.getCurrentCard(game.state)
      expect(deck).toBeUndefined()
    })

    it('get first card from deck', () => {
      game.state.deck = [['first']]
      const deck = game.getters.getCurrentCard(game.state)
      expect(deck).toEqual(expect.arrayContaining(game.state.deck[0]))
    })
  })

  describe('getTotalPlaced', () => {
    beforeEach(() => {
      game.state.userStories = [['first'], ['second']]
      game.state.deck = []
      game.state.scale = [ { cards: [] } ]
    })

    it('get cards number placed when no cards placed', () => {
      const cardsPlaced = game.getters.getTotalPlaced(game.state)
      expect(cardsPlaced).toBe(0)
    })

    it('get cards number placed when there is cards placed', () => {
      game.state.scale = [ { cards: [ { id: 1 } ] } ]
      const cardsPlaced = game.getters.getTotalPlaced(game.state)
      expect(cardsPlaced).toBe(1)
    })
  })

  describe('totalGameUserStories', () => {
    it('get total us in game when there is no cards in deck', () => {
      game.state.deck = []
      game.getters.getTotalPlaced = 0
      const totalCards = game.getters.totalGameUserStories(game.state, game.getters)
      expect(totalCards).toBe(0)
    })

    it('get total us in game when there is cards in deck', () => {
      game.state.deck = [['first']]
      game.getters.getTotalPlaced = 0
      const totalCards = game.getters.totalGameUserStories(game.state, game.getters)
      expect(totalCards).toBe(1)
    })

    it('get total us in game when there is cards in deck and placed', () => {
      game.state.deck = [['first']]
      game.getters.getTotalPlaced = 1
      const totalCards = game.getters.totalGameUserStories(game.state, game.getters)
      expect(totalCards).toBe(2)
    })
  })

  describe('getProjectDefaultImage', () => {
    it('set user default image', () => {
      game.state.projectDefaultImages = {
        images: [
          'project-logo-01.png'
        ],
        colors: [
          'rgba( 153,  214, 220, 1 )',
          'rgba( 213,  156,  156, 1 )'
        ]
      }
      const resultImage = [
        [ 'rgba( 153,  214, 220, 1 )', 'project-logo-01.png' ],
        [ 'rgba( 213,  156,  156, 1 )', 'project-logo-01.png' ]
      ]
      const image = game.getters.getProjectDefaultImage(game.state)
      expect(image).toEqual(expect.arrayContaining(resultImage))
    })
  })
})
