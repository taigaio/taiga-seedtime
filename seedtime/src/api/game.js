/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

export default http => ({
  async save (gameComplete) {
    const GAME = {
      name: gameComplete.name,
      project: gameComplete.projectData.id,
      roles: gameComplete.roles,
      scales: gameComplete.scale,
      userstories: gameComplete.userStories,
      discard: gameComplete.discard,
      notnow: gameComplete.notNow
    }

    const result = await http.post(
      `seedtime/games`,
      GAME
    )
    return result.data
  },
  async get (uuid) {
    const result = await http.get(`seedtime/games/${uuid}`)
    return result.data
  },
  async update (uuid, game) {
    const GAME = {
      roles: game.roles || undefined,
      scales: game.scale || undefined,
      userstories: game.userStories,
      discard: game.discard || undefined,
      notnow: game.notNow || undefined,
      version: 1
    }

    const result = await http.patch(`seedtime/games/${uuid}`, GAME)
    return result.data
  },
  async confirm (uuid) {
    const result = await http.post(`seedtime/games/${uuid}/commit`)
    return result.data
  }
})
