/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import modal from '@/store/modules/modal'

describe('Vuex Modal Mutations', () => {
  describe('OPEN_MODAL', () => {
    it('OPEN_MODAL no search', () => {
      modal.state.search = false
      modal.state.current = undefined

      const type = 'addUs'
      modal.mutations.OPEN_MODAL(modal.state, type)
      expect(modal.state.search).toBeFalsy()
      expect(modal.state.current).toBe(type)
    })

    it('OPEN_MODAL search', () => {
      modal.state.search = false
      modal.state.current = undefined

      const type = 'search'
      modal.mutations.OPEN_MODAL(modal.state, type)
      expect(modal.state.search).toBeTruthy()
      expect(modal.state.current).toBe(type)
    })
  })

  describe('CLOSE_MODAL', () => {
    it('CLOSE_MODAL not SHOULD_NOT_CLOSE_SEARCH', () => {
      modal.state.search = true
      modal.state.current = 'addUs'

      modal.mutations.CLOSE_MODAL(modal.state)
      expect(modal.state.search).toBeFalsy()
      expect(modal.state.current).toBeUndefined()
    })

    it('CLOSE_MODAL SHOULD_NOT_CLOSE_SEARCH', () => {
      modal.state.search = true
      modal.state.current = 'showUsDetail'

      modal.mutations.CLOSE_MODAL(modal.state)
      expect(modal.state.search).toBeTruthy()
      expect(modal.state.current).toBeUndefined()
    })
  })
})
