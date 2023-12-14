<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgSearchUs.pug'></template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

  import draggable from 'vuedraggable'

  import locales from '@/translations/translations'

  export default {
    name: 'TgSearchUs',
    data () {
      return {
        filterName: '',
        filterUs: []
      }
    },
    locales,
    components: {
      draggable
    },
    created () {
      this.filterUs = this.filterUserStoryName
    },
    computed: {
      ...mapState({
        deck: state => state.game.deck
      }),
      ...mapGetters({
        getUserStory: 'game/getUserStory'
      }),
      filterUserStoryName () {
        return this.deck
          .filter(userStory => {
            const us = this.getUserStory(userStory.id)
            const usByName = us.subject.toLowerCase()
              .match(this.filterName.toLowerCase())
            const usById = us.ref.toString()
              .match(this.filterName.toString())
            return usById || usByName
          }
        )
      }
    },
    methods: {
      ...mapActions({
        fromScales: 'game/fromScales'
      }),
      ...mapMutations({
        closeModal: 'modal/CLOSE_MODAL',
        openModal: 'modal/OPEN_MODAL',
        setCurrentUS: 'search/SET_CURRENT_US'
      }),
      open (userStoryId) {
        this.setCurrentUS(userStoryId.id)
        this.openModal('showUsDetail')
      },
      close () {
        this.closeModal()
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
        if (from.name === 'scale' && to.name === 'search') {
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

<style lang='css' src='./TgSearchUs.css' scoped></style>
