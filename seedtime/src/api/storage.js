/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

class AbstractStorageManager {
  get (key) {
    return JSON.parse(this.storage.getItem(key))
  }
  set (key, newValue = undefined) {
    this.storage.setItem(
      key,
      JSON.stringify(newValue)
    )

    return newValue
  }
  remove (key) {
    this.storage.removeItem(key)

    return true
  }
  clear () {
    this.storage.clear()

    return true
  }
}

class LocalStorageManager extends AbstractStorageManager {
  constructor () {
    super()
    this.storage = window.localStorage
  }
}

class SessionStorageManager extends AbstractStorageManager {
  constructor () {
    super()
    this.storage = window.sessionStorage
  }
}

export const localStorage = new LocalStorageManager()
export const sessionStorage = new SessionStorageManager()
