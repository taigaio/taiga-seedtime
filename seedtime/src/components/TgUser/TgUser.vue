<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgUser.pug'></template>

<script>
  import Vue from 'vue'
  import { mapGetters, mapState } from 'vuex'
  import locales from '@/translations/translations'
  import murmurhash from 'murmurhash-js'

  export default {
    name: 'TgUser',
    locales,
    data () {
      return {
        baseUrl: Vue.config.estimations.BASE_URL,
        showMenu: false
      }
    },
    computed: {
      ...mapState({
        me: state => state.user.me
      }),
      ...mapGetters({
        getDefaultImages: 'user/getUserDefaultImage'
      }),
      defaultImage () {
        if (!this.me.gravatar_id) {
          return false
        }
        const key = this.me.gravatar_id
        const murmurId = murmurhash(key, 42) % this.getDefaultImages.length
        const logo = this.getDefaultImages[murmurId]
        const logoUrl = `${this.baseUrl}static/img/user-avatars/${logo[1]}`
        const root = `https://www.gravatar.com/avatar/${key}?s=200&d=${encodeURIComponent(logoUrl)}`

        return {
          color: logo[0],
          src: (Vue.config.estimations.NODE_ENV === 'production') ? root : logoUrl
        }
      }
    },
    methods: {
      toggleMenu () {
        this.showMenu = !this.showMenu
      }
    }
  }
</script>

<style lang='css' src='./TgUser.css' scoped></style>
