/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import user from '@/store/modules/user'

describe('Vuex User Getters', () => {
  describe('getUserDefaultImage', () => {
    it('set user default image', () => {
      user.state.userDefaultImages = {
        images: [
          'user-avatar-01.png'
        ],
        colors: [
          'rgba( 178, 176, 204, 1 )',
          'rgba( 183, 203, 131, 1 )'
        ]
      }
      const resultImage = [
        [ 'rgba( 178, 176, 204, 1 )', 'user-avatar-01.png' ],
        [ 'rgba( 183, 203, 131, 1 )', 'user-avatar-01.png' ]
      ]
      const image = user.getters.getUserDefaultImage(user.state)
      expect(image).toEqual(expect.arrayContaining(resultImage))
    })
  })
})
