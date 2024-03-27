/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import search from '@/store/modules/search'

describe('Vuex Search Mutations', () => {
  it('SET_CURRENT_US', () => {
    search.state.currentUS = {}
    const currentUS = 70
    search.mutations.SET_CURRENT_US(search.state, currentUS)
    expect(search.state.currentUS).toBe(currentUS)
  })

  describe('SET_CURRENT_ATTACHMENTS', () => {
    it('SET_CURRENT_ATTACHMENTS not deprecated', () => {
      search.state.currentAttachments = []
      const currentAttachments = [{
        id: 573,
        object_id: 70,
        name: 'sample_attachment_3.txt',
        preview_url: '',
        url: '',
        is_deprecated: false
      }]
      search.mutations.SET_CURRENT_ATTACHMENTS(search.state, currentAttachments)
      expect(search.state.currentAttachments).toEqual(currentAttachments)
    })

    it('SET_CURRENT_ATTACHMENTS deprecated', () => {
      search.state.currentAttachments = []
      const currentAttachments = [{
        id: 573,
        object_id: 70,
        name: 'sample_attachment_3.txt',
        preview_url: '',
        url: '',
        is_deprecated: true
      }]
      search.mutations.SET_CURRENT_ATTACHMENTS(search.state, currentAttachments)
      expect(search.state.currentAttachments).toEqual([])
    })
  })
})
