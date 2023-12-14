/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

// import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { mount as _mount, shallowMount as _shallowMount } from '@vue/test-utils'

export function spyFor () {
  // Returns an object like {arg0: jest.fn(), ...argN: jest.fn()} for the given args
  return Array.from(arguments).reduce((result, arg) => {
    result[arg] = jest.fn()
    return result
  }, {})
}

export function resolvedPromise (promiseResult) {
  return jest.fn(() => Promise.resolve(promiseResult))
}

export function rejectedPromise (promiseError) {
  return jest.fn(() => Promise.reject(promiseError))
}

export function resolvedStub (methodName, promiseResult) {
  // Returns the methodName method stubbed to return a resolved promise with value promiseResult
  const result = {}
  result[methodName] = resolvedPromise(promiseResult)
  return result
}

export function rejectedStub (methodName, promiseError) {
  // Returns the methodName method stubbed to return a rejected promise with value promiseResult
  const result = {}
  result[methodName] = rejectedPromise(promiseError)
  return result
}

// export function cloneProductionStore() {
//   return new Vuex.Store({
//     state: deepCopy(initialState),
//     actions,
//     mutations,
//     getters
//   })
// }

export function Wrap (component) {
  return {mount, shallow, withProps, withSlots, withRouter, withStore, withParamId, config}

  function withProps (props) {
    this.props = props
    return this
  }

  function withStore (store) {
    this.store = store
    return this
  }

  function withRouter (router) {
    this.router = new VueRouter()
    return this
  }

  function withSlots (slots) {
    this.slots = slots
    return this
  }

  function withParamId (id) {
    component.methods.paramId = () => id
    return this
  }

  function mount () {
    return _mount(component, this.config())
  }

  function shallow () {
    return _shallowMount(component, this.config())
  }

  function config () {
    return { propsData: this.props, slots: this.slots, router: this.router, store: this.store }
  }
}
