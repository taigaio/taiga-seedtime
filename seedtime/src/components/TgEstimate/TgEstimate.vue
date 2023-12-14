<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgEstimate.pug'></template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import TgUserStory from '@/components/TgUserStory/TgUserStory'
  import TgUsFeedback from '@/components/TgUsFeedback/TgUsFeedback'
  import TgProgressBar from '@/components/TgProgressBar/TgProgressBar'

  import draggable from 'vuedraggable'

  import locales from '@/translations/translations'

  export default {
    name: 'TgEstimate',
    locales,
    data () {
      return {
        disclamerModal: false,
        addModal: false,
        scaleCards: []
      }
    },
    components: {
      TgUserStory,
      TgUsFeedback,
      TgProgressBar,
      draggable
    },
    created () {
      this.scaleCards = [this.currentCard]
    },
    computed: {
      ...mapState({
        scales: state => state.game.scale,
        deck: state => state.game.deck,
        projectData: state => state.game.projectData
      }),
      ...mapGetters({
        currentCard: 'game/getCurrentCard'
      }),
      disabled () {
        return !this.currentCard
      }
    },
    methods: {
      ...mapActions({
        shuffle: 'game/shuffle',
        discard: 'game/discard',
        notNow: 'game/notNow',
        fromScales: 'game/fromScales'
      }),
      ...mapMutations({
        addCardScale: 'game/ADD_CARD_SCALE',
        openModal: 'modal/OPEN_MODAL',
        notifyText: 'modal/NOTIFY_TEXT'
      }),
      openAddModal () {
        this.addModal = true
        this.disclamerModal = false
      },
      closeAddModal () {
        this.addModal = false
      },
      openDisclamerModal () {
        this.disclamerModal = true
        this.addModal = false
      },
      closeDisclamerModal () {
        this.disclamerModal = false
      },
      addUs (type) {
        this.openModal(type)
        this.addModal = false
      },
      async discardUs () {
        this.discard(this.currentCard.id)
        this.closeDisclamerModal()
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
      },
      hasCreatePermission () {
        const addUs = this.projectData.permissions.find(el => el === 'add_us')
        return addUs
      },
      async onAdd (event) {
        const from = {
          id: Number(event.from.id),
          name: event.from.attributes['data-name'].nodeValue
        }
        const item = {
          id: Number(event.item.attributes['data-card-id'].nodeValue)
        }
        const to = {
          id: Number(event.to.id),
          name: event.to.attributes['data-name'].nodeValue
        }
        if (from.name === 'scale' && to.name === 'deck') {
          try {
            const move = await this.fromScales({
              fromScale: from.id,
              selectedCardId: item.id
            })
            if (!move) {
              event.from.appendChild(event.item)
              event.to.removeChild(event.item)
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
  }
</script>

<style lang='css' src='./TgEstimate.css' scoped></style>
