<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<script>
  export default {
    name: 'TgButton',
    props: {
      label: {
        type: String,
        required: false
      },
      type: {
        type: String,
        default: 'button',
        required: true,
        validator (value) {
          return value === 'a' || value === 'button'
        }
      },
      href: {
        type: String,
        default: '#',
        required: false
      },
      alt: {
        type: String,
        default: undefined,
        required: false
      },
      title: {
        type: String,
        default: undefined,
        required: false
      }
    },
    render (createElement) {
      const _this = this

      return createElement(
        this.type,
        {
          attrs: {
            name: this.type === 'button' ? this.label : undefined,
            href: this.type === 'a' ? this.href : undefined,
            alt: this.alt,
            title: this.title
          },
          class: {
            button: 'true'
          },
          on: {
            click (event) {
              if (_this.type === 'a') {
                return
              }

              _this.$emit('click', event)
              event.preventDefault()
            }
          }
        },
        this.$slots.default
      )
    }
  }
</script>

<style lang='css' src='./TgButton.css' scoped></style>
