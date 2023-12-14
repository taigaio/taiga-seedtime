<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgUserStory.pug'></template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

  import TgRoles from '@/components/TgRoles/TgRoles'

  import locales from '@/translations/translations'

  export default {
    name: 'TgUserStory',
    locales,
    components: {
      TgRoles
    },
    props: {
      card: {
        type: Object,
        default: {},
        required: false
      },
      scaleId: {
        type: Number,
        default: undefined,
        required: false
      },
      selected: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        showRoles: false
      }
    },
    computed: {
      ...mapState({
        roles: state => state.game.roles
      }),
      ...mapGetters({
        getUserStory: 'game/getUserStory'
      }),
      info () {
        if (Object.keys(this.card).length) {
          return this.getUserStory(this.card.id)
        }
        return false
      }
    },
    methods: {
      ...mapMutations({
        closeModal: 'modal/CLOSE_MODAL',
        openModal: 'modal/OPEN_MODAL',
        setCurrentUS: 'search/SET_CURRENT_US'
      }),
      ...mapActions({
        fromDesk: 'game/fromDesk',
        betweenScales: 'game/betweenScales',
        fromScales: 'game/fromScales'
      }),
      toggleRoles () {
        this.showRoles = !this.showRoles
      },
      close () {
        if (this.showRoles) {
          this.showRoles = false
        }
      },
      openUs (userStoryId) {
        this.setCurrentUS(userStoryId.id)
        this.openModal('showUsDetail')
      }
    }
  }
</script>

<style lang='css' src='./TgUserStory.css' scoped></style>
