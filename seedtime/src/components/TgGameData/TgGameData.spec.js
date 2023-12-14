/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import TgGameData from '@/components/TgGameData/TgGameData'
import { shallowMount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'

const getStore = () => {
  return new Store({
    state: {
      game: {
        projectData: {
          slug: 'project-3'
        },
        name: undefined,
        scale: [
          { id: 25, name: '?', order: 1 },
          { id: 26, name: '0', order: 2 },
          { id: 27, name: '1/2', order: 3 },
          { id: 28, name: '1', order: 4 },
          { id: 29, name: '2', order: 5 },
          { id: 30, name: '3', order: 6 },
          { id: 31, name: '5', order: 7 },
          { id: 32, name: '8', order: 8 },
          { id: 33, name: '10', order: 9 },
          { id: 34, name: '13', order: 10 },
          { id: 35, name: '20', order: 11 },
          { id: 36, name: '40', order: 12 }
        ],
        scaleType: 'tshirts',
        roles: [
          { id: 13, name: 'UX' },
          { id: 14, name: 'Diseñador' },
          { id: 15, name: 'Front' },
          { id: 16, name: 'Back' }
        ]
      }
    }
  })
}

const store = getStore()
afterEach(() => store.reset())

const getWrapper = (...params) => {
  return shallowMount(
    TgGameData,
    ...params
  )
}

describe('TgGameData', () => {
  it('it calls setProjectDetails method on created', () => {
    const setProjectDetails = jest.fn()
    getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    expect(setProjectDetails).toHaveBeenCalledTimes(1)
  })

  it('check visibility', () => {
    const setProjectDetails = jest.fn()
    const wrapper = getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    expect(wrapper.contains('[data-test="form"]')).toBe(true)
    expect(wrapper.contains('[data-test="nextStepComponent"]')).toBe(true)
  })

  it('set game name', () => {
    const setProjectDetails = jest.fn()
      .mockReturnValue({
        id: 4,
        name: 'Project Example 3',
        slug: 'project-3',
        points: [
          { id: 37, name: '?', order: 1 },
          { id: 38, name: '0', order: 2 },
          { id: 39, name: '1/2', order: 3 }
        ],
        roles: [
          { id: 19, name: 'UX' },
          { id: 20, name: 'Design' },
          { id: 21, name: 'Front' },
          { id: 22, name: 'Back' }
        ],
        my_permissions: [],
        is_backlog_activated: true
      })
    const wrapper = getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    expect(setProjectDetails).toHaveBeenCalledTimes(1)

    const gameName = 'test'
    wrapper.find('[data-test="gameName"]').setValue(gameName)

    expect(store.commit).toHaveBeenCalledWith('game/SET_NAME', gameName)
  })

  it('step incomplete with no name', () => {
    const setProjectDetails = jest.fn()
    const wrapper = getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    wrapper.vm.setComplete()
    expect(store.commit).toHaveBeenCalledWith('step/SET_COMPLETE', false)
  })

  it('step incomplete with no scale', () => {
    const setProjectDetails = jest.fn()
    const wrapper = getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    const gameName = 'test'
    store.state.game.name = gameName

    wrapper.find('[data-test="allScalesSelected"]').trigger('click', {
      checked: ''
    })
    store.state.game.name = wrapper.vm.scalesSelected.length

    wrapper.vm.setComplete()
    expect(store.commit).toHaveBeenCalledWith('step/SET_COMPLETE', false)
  })

  it('step incomplete with no scale type', () => {
    const setProjectDetails = jest.fn()
    const wrapper = getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    const gameName = 'test'
    store.state.game.name = gameName

    store.state.game.scaleType = ''

    wrapper.vm.setComplete()
    expect(store.commit).toHaveBeenCalledWith('step/SET_COMPLETE', false)
  })

  it('step complete', () => {
    const setProjectDetails = jest.fn()
    const wrapper = getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    const gameName = 'test'
    store.state.game.name = gameName

    wrapper.vm.setComplete()
    expect(store.commit).toHaveBeenCalledWith('step/SET_COMPLETE', true)
  })

  it('change scale type', () => {
    const setProjectDetails = jest.fn()
    const wrapper = getWrapper({
      mocks: { $store: store },
      methods: { setProjectDetails }
    })

    const selectType = 'tshirts'
    const select = wrapper.find('[data-test="selectScaleType"]')
    select.setValue(selectType)
    store.state.game.scaleType = wrapper.vm.selectScaleType
    wrapper.find('[data-test="allScalesSelected"]').setChecked(true)

    expect(wrapper.vm.selectScaleType).toBe(selectType)
    expect(wrapper.vm.scales[wrapper.vm.selectScaleType]).toEqual(wrapper.vm.scalesSelected)
  })
})
