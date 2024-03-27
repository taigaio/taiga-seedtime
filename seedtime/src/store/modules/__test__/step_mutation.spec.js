/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import step from '@/store/modules/step'

describe('Vuex Step Mutations', () => {
  it('RESET_STEPS', () => {
    step.state.current = 4
    step.state.complete = true
    step.state.total = 4

    step.mutations.RESET_STEPS(step.state)
    expect(step.state.complete).toBeFalsy()
    expect(step.state.current).toBe(1)
  })

  it('SET_STEP', () => {
    const stepCurrent = 4
    step.state.current = 1

    step.mutations.SET_STEP(step.state, stepCurrent)
    expect(step.state.current).toBe(stepCurrent)
  })

  it('SET_COMPLETE', () => {
    step.state.complete = false

    step.mutations.SET_COMPLETE(step.state, true)
    expect(step.state.complete).toBeTruthy()
  })
})
