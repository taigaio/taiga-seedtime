<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang="pug" src='./TgGameActions.pug'></template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'

  import locales from '@/translations/translations'

  export default {
    name: 'TgGameActions',
    locales,
    components: {
      TgButton
    },
    data () {
      return {
        override: true,
        showModal: false
      }
    },
    computed: {
      ...mapState({
        zoomIn: state => state.game.zoomIn,
        isUsEstimated: state => state.game.isUsEstimated
      }),
      ...mapGetters({
        getTotalPlaced: 'game/getTotalPlaced'
      })
    },
    methods: {
      ...mapMutations({
        toggleZoom: 'game/TOGGLE_ZOOM',
        openModal: 'modal/OPEN_MODAL',
        closeModal: 'modal/CLOSE_MODAL',
        notifyText: 'modal/NOTIFY_TEXT'
      }),
      ...mapActions({
        sendEstimationToTaiga: 'game/sendEstimationToTaiga'
      }),
      async sendEstimation () {
        if (this.isUsEstimated && this.override) {
          this.showModal = true
          return false
        }
        try {
          await this.sendEstimationToTaiga()
          this.showModal = false
          this.override = true
          this.closeModal()
          this.notifyText({text: 'ESTIMATE_SEND_OK', error: false})
          this.openModal('notify')
        } catch (error) {
          this.closeModal()
          this.notifyText({text: 'ERROR_TEXT', error: true})
          this.openModal('notify')
        }
        return true
      },
      overrideEstimation () {
        this.override = false
        this.sendEstimation()
      },
      cancelEstimation () {
        this.showModal = false
      }
    }
  }
</script>

<style land='css' src='./TgGameActions.css' scoped></style>
