<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgUsDetails.pug'></template>

<script>
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'
  import TgRoles from '@/components/TgRoles/TgRoles'
  import TgIconBase from '@/components/TgIconBase'
  import TgIconAttachment from '@/components/TgIcons/TgIconAttachment'

  import locales from '@/translations/translations'

  export default {
    name: 'TgUsDetails',
    data () {
      return {
        isBlocking: false,
        isBlocked: false,
        blockedReason: '',
        spinner: false
      }
    },
    locales,
    components: {
      TgButton,
      TgRoles,
      TgIconBase,
      TgIconAttachment
    },
    computed: {
      ...mapState({
        currentUS: state => state.search.currentUS,
        currentAttachments: state => state.search.currentcurrentAttachments || 0,
        projectData: state => state.game.projectData,
        roles: state => state.game.roles
      }),
      ...mapGetters({
        getUserStory: 'game/getUserStory'
      }),
      userStory () {
        return this.getUserStory(this.currentUS)
      },
      usRoute () {
        return `${Vue.config.estimations.TAIGA_FRONT}project/${this.projectData.slug}/us/${this.userStory.ref}`
      }
    },
    created () {
      this.getAttachment({
        projectID: this.projectData.id,
        userStoryID: this.userStory.id
      })
    },
    methods: {
      ...mapActions({
        getAttachment: 'search/getAttachment',
        updateUserStory: 'game/updateUserStory',
        discard: 'game/discard'
      }),
      ...mapMutations({
        closeModal: 'modal/CLOSE_MODAL',
        setCurrentUS: 'search/SET_CURRENT_US',
        openModal: 'modal/OPEN_MODAL',
        notifyText: 'modal/NOTIFY_TEXT'
      }),
      hasEditPermission () {
        const modifyUs = this.projectData.permissions.find(el => el === 'modify_us')
        return modifyUs
      },
      blocking (blocked) {
        this.isBlocking = blocked
      },
      blockUs () {
        this.spinner = true
        this.updateUserStory({
          id: this.currentUS,
          values: {
            blocked_note: this.blockedReason,
            is_blocked: true
          }
        })
          .then(updatedUserStory => {
            this.setCurrentUS(updatedUserStory.id)
            this.isBlocked = true
            this.isBlocking = false
            this.blockedReason = ''
            this.spinner = false
          })
          .catch(error => {
            console.error(error)
            this.closeModal()
            this.notifyText({text: 'ERROR_TEXT', error: true})
            this.openModal('notify')
          })
      },
      unblockUs () {
        if (this.userStory.is_blocked) {
          this.spinner = true
          this.updateUserStory({
            id: this.currentUS,
            values: {
              blocked_note: '',
              is_blocked: false
            }
          })
            .then(updatedUserStory => {
              this.setCurrentUS(updatedUserStory.id)
              this.spinner = false
            })
            .catch(error => {
              console.error(error)
              this.closeModal()
              this.notifyText({text: 'ERROR_TEXT', error: true})
              this.openModal('notify')
            })
        }
      },
      async discardUs () {
        this.discard(this.currentUS)
        this.closeModal()
        try {
          await this.notifyText({text: 'NOTIFY_SUCCESS', error: false})
        } catch (error) {
          console.error(error)
        }
        try {
          await this.openModal('notify')
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>

<style lang='css' src='./TgUsDetails.css' scoped></style>
