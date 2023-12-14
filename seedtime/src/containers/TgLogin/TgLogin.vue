<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgLogin.pug'></template>

<script>
  import Vue from 'vue'
  import { mapActions } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'

  import { authService } from '@/api'
  import locales from '@/translations/translations'

  export default {
    name: 'TgLogin',
    locales,
    components: {
      TgButton
    },
    beforeRouteEnter (to, from, next) {
      if (authService.token.get()) {
        return next({
          name: 'intro'
        })
      }

      return next()
    },
    data () {
      return {
        state: undefined,
        taigaLoginRoute: undefined
      }
    },
    watch: {
      state (newValue) {
        this.taigaLoginRoute = `${Vue.config.estimations.TAIGA_TREE}?` +
          `application=${Vue.config.estimations.APP_KEY}` +
          `&state=${newValue}`
      }
    },
    props: {
      authCode: {
        type: String,
        default: undefined,
        required: false
      },
      notFound: {
        type: String,
        default: undefined,
        required: false
      },
      next: {
        type: String,
        default: undefined,
        required: false
      }
    },
    created () {
      return this.access()
    },
    methods: {
      // If we use array options, we need to use this getter like this:
      //   this['user/me'] or this.$store.actions['user/me']
      // This way is more easy to use
      ...mapActions({
        setMe: 'user/setMe'
      }),
      access () {
        if (!this.authCode && !this.notFound) {
          this.state = authService.state.set()

          if (this.next) {
            authService.next.set(this.next)
          }
        }

        if (this.authCode) {
          return authService.validate(this.authCode)
            .then(() => this.setMe())
            .then(() => {
              let route = { name: 'intro' }
              const NEXT = authService.next.get()
              authService.next.remove()
              if (NEXT) {
                route = { path: NEXT }
              }

              return this.$router.push(route)
            })
            .catch(() => {
              let query = {}
              this.$router.replace({ query })
              location.reload()
              return true
            })
        }

        return false
      }
    }
  }
</script>

<style lang='css' src='./TgLogin.css' scoped></style>
