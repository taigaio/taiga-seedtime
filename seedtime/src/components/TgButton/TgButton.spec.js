/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { render } from '@vue/server-test-utils'

import TgButton from '@/components/TgButton/TgButton.vue'

describe('TgButton', () => {
  it('render anchor element', async () => {
    const wrapper = await render(TgButton, {
      propsData: {
        label: '',
        type: 'a',
        href: 'www.test.dev',
        alt: 'test alt',
        title: 'test title'
      },
      slots: {
        default: 'test slot'
      }
    })

    expect(wrapper.attr('href')).toBe('www.test.dev')
    expect(wrapper.attr('alt')).toBe('test alt')
    expect(wrapper.attr('title')).toBe('test title')
    expect(wrapper.attr('label')).toBe(undefined)
    expect(wrapper.text()).toContain('test slot')
  })

  it('render button element', async () => {
    const wrapper = await render(TgButton, {
      propsData: {
        label: 'my button',
        type: 'button',
        href: '',
        alt: 'test alt',
        title: 'test title'
      },
      slots: {
        default: 'test slot'
      }
    })

    expect(wrapper.attr('href')).toBe(undefined)
    expect(wrapper.attr('alt')).toBe('test alt')
    expect(wrapper.attr('class')).toBe('button')
    expect(wrapper.attr('title')).toBe('test title')
    expect(wrapper.attr('name')).toBe('my button')
    expect(wrapper.text()).toContain('test slot')
  })
})
