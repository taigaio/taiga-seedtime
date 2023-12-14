<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgLogo.pug'></template>

<script>
  import { mapState } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'

  import locales from '@/translations/translations'

  export default {
    name: 'TgLogo',
    locales,
    data () {
      return {
        showMenu: false
      }
    },
    components: {
      TgButton
    },
    props: {
      isGame: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      ...mapState({
        gameName: state => state.game.name,
        projectData: state => state.game.projectData
      })
    },
    methods: {
      toggleMenu () {
        const gameRoutes = ['play', 'summary']
        const currentRoute = this.$router.history.current.name
        if (gameRoutes.includes(currentRoute)) {
          this.showMenu = !this.showMenu
        }
      }
    }
  }
</script>

<style lang='css' src='./TgLogo.css' scoped></style>
