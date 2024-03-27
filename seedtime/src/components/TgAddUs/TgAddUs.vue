<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgAddUs.pug'></template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'

  import locales from '@/translations/translations'

  export default {
    name: 'TgAddUs',
    locales,
    data () {
      return {
        usTitle: undefined,
        usDescription: undefined,
        usBulk: undefined,
        spinner: false,
        single: true,
        bulk: false
      }
    },
    computed: {
      ...mapState({
        gameUs: state => state.game.gameUs
      }),
      disabledSingle () {
        return !this.usTitle
      },
      disabledBulk () {
        return !this.usBulk
      }
    },
    watch: {
      gameUs () {
        this.closeModal()
        this.notifyText({text: 'ADD_EXISTING_US_NOTIFY_SUCCESS', error: false})
        this.openModal('notify')
      }
    },
    methods: {
      ...mapMutations({
        openModal: 'modal/OPEN_MODAL',
        notifyText: 'modal/NOTIFY_TEXT',
        closeModal: 'modal/CLOSE_MODAL'
      }),
      ...mapActions({
        createUserStory: 'game/createUserStory',
        setNewBulkUs: 'game/setNewBulkUs'
      }),
      toggleTab () {
        this.single = !this.single
        this.bulk = !this.bulk
        if (this.bulk) {
          this.usTitle = undefined
          this.usDescription = undefined
        } else if (this.single) {
          this.usBulk = undefined
        }
      },
      async submit () {
        this.spinner = true
        if (this.usTitle) {
          try {
            await this.createUserStory({
              title: this.usTitle,
              description: this.usDescription
            })
            this.spinner = false
          } catch (error) {
            this.closeModal()
            this.notifyText({text: 'ERROR_TEXT', error: true})
            this.openModal('notify')
          }
        } else if (this.usBulk) {
          try {
            await this.setNewBulkUs({
              stories: this.usBulk
            })
            this.spinner = false
          } catch (error) {
            this.closeModal()
            this.notifyText({text: 'ERROR_TEXT', error: true})
            this.openModal('notify')
          }
        }
      }
    }
  }
</script>

<style lang='css' src='./TgAddUs.css' scoped></style>
