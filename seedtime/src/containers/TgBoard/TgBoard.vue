<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgBoard.pug'></template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import TgEvents from '@/components/TgEvents/TgEvents'
  import TgUserStory from '@/components/TgUserStory/TgUserStory'
  import draggable from 'vuedraggable'

  import locales from '@/translations/translations'

  export default {
    name: 'TgBoard',
    data () {
      return {
        emptyBoard: false,
        scaleCards: []
      }
    },
    locales,
    components: {
      TgEvents,
      TgUserStory,
      draggable
    },
    computed: {
      ...mapState({
        projectData: state => state.game.projectData,
        gameID: state => state.game.id,
        gameUUID: state => state.game.uuid,
        scales: state => state.game.scale,
        zoomIn: state => state.game.zoomIn
      }),
      ...mapGetters({
        getTotalPlaced: 'game/getTotalPlaced'
      }),
      eventsSubscriptionForUserStories () {
        return `changes.project.${this.projectData.id}.userstories`
      },
      eventsSubscriptionForGames () {
        return `changes.project.${this.projectData.id}.taiga_seedtime.game`
      },
      eventsSubscriptions () {
        return [
          this.eventsSubscriptionForUserStories,
          this.eventsSubscriptionForGames
        ]
      }
    },
    created () {
      this.$forceUpdate()
      this.scaleCards = this.scales
      if (this.getTotalPlaced < 1) {
        this.emptyBoard = true
      }
    },
    mounted () {
      let maxHeight = 0
      if (!maxHeight && this.$el.parentNode) {
        let game = this.$el.parentNode.parentNode
        let header = game.childNodes[0].clientHeight
        let tabs = game.childNodes[1].clientHeight
        let footer = game.childNodes[3].clientHeight
        maxHeight = header + tabs + footer
        this.$refs.title.style.height = `calc(100vh - ${maxHeight}px - 1rem)`
        this.$refs.title.style.maxHeight = `calc(100vh - ${maxHeight}px - 1.5rem)`
      }

      let initialHeight = 0
      this.$refs.title.addEventListener('scroll', (e) => {
        let currentHeight = e.target.scrollHeight
        if (currentHeight !== initialHeight) {
          let scale = document.querySelectorAll('.scale')
          for (let i = 0; i < scale.length; i++) {
            scale[i].style.height = `${(currentHeight)}px`
          }
          initialHeight = currentHeight
        }
      }, false)

      if (this.zoomIn) {
        this.$refs.title.classList.add('zoom')
      } else {
        this.$refs.title.classList.remove('zoom')
      }
    },
    watch: {
      getTotalPlaced (value) {
        if (value < 1) {
          this.emptyBoard = true
        }
      },
      zoomIn (value) {
        if (value) {
          this.$refs.title.classList.add('zoom')
        } else {
          this.$refs.title.classList.remove('zoom')
        }
      }
    },
    methods: {
      ...mapMutations({
        openModal: 'modal/OPEN_MODAL',
        closeModal: 'modal/CLOSE_MODAL',
        notifyText: 'modal/NOTIFY_TEXT'
      }),
      ...mapActions({
        updateGame: 'game/updateGame',
        fromDeck: 'game/fromDeck',
        betweenScales: 'game/betweenScales',
        fromSearch: 'game/fromSearch',
        refreshUserStory: 'game/refreshUserStory'
      }),
      async loadGameComplete () {
        try {
          await this.updateGame({
            gameUUID: this.gameUUID
          })
        } catch (error) {
          this.closeModal()
          this.notifyText({text: 'ERROR_TEXT', error: true})
          this.openModal('notify')
        }
      },
      async onAdd (event) {
        this.emptyBoard = false

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
        if (from.name === 'deck' && to.name === 'scale') {
          try {
            const move = await this.fromDeck({
              toScale: to.id,
              selectedCardId: item.id
            })
            if (!move) {
              event.from.appendChild(event.item)
              event.to.removeChild(event.item)
            }
          } catch (error) {
            console.error(error)
          }
        } else if (from.name === 'scale' && to.name === 'scale') {
          try {
            const move = await this.betweenScales({
              fromScale: from.id,
              toScale: to.id,
              selectedCardId: item.id
            })
            if (!move) {
              event.from.appendChild(event.item)
              event.to.removeChild(event.item)
            }
          } catch (error) {
            console.error(error)
          }
        } else if (from.name === 'search' && to.name === 'scale') {
          try {
            const move = await this.fromSearch({
              toScale: to.id,
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
      },
      processEventsMessage (routingKey, data) {
        this.emptyBoard = false
        switch (routingKey) {
          case this.eventsSubscriptionForGames:
            // Only events for this game
            if (this.gameID === data.pk) {
              this.loadGameComplete()
            }
            break
          case this.eventsSubscriptionForUserStories:
            this.refreshUserStory(data.pk)
            break
        }
      }
    }
  }
</script>

<style lang='css' src='./TgBoard.css' scoped></style>
