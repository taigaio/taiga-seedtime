<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgUsFeedback.pug'></template>
<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'

  import locales from '@/translations/translations'

  import TgButton from '@/components/TgButton/TgButton'
  import TgEstimationFeedback from '@/components/TgEstimationFeedback/TgEstimationFeedback'

  export default {
    name: 'TgUsFeedback',
    locales,
    components: {
      TgEstimationFeedback,
      TgButton
    },
    data () {
      return {
        type: undefined,
        checkEstimation: false,
        feedbackKeyPercent: 66,
        usEstimate: 0
      }
    },
    created () {
      this.checkFeedback()
    },
    watch: {
      userStoriesPlaced () {
        this.checkFeedback()
        this.usEstimate++
      }
    },
    computed: {
      ...mapState({
        gameFinished: state => state.game.gameFinished
      }),
      ...mapGetters({
        userStoriesPlaced: 'game/getTotalPlaced',
        totalGameUserStories: 'game/totalGameUserStories'
      })
    },
    methods: {
      ...mapMutations({
        setFinishedGame: 'game/SET_FINISHED_GAME'
      }),
      checkFeedback () {
        this.type = undefined
        this.checkEstimation = false
        let usleft = this.totalGameUserStories - this.userStoriesPlaced
        if (this.userStoriesPlaced) {
          if (this.userStoriesPlaced === this.totalGameUserStories && !this.gameFinished) {
            this.type = 'percent_100'
            this.usEstimate = 0
            this.setFinishedGame(true)
          } else if (this.userStoriesPlaced === this.round(this.totalGameUserStories / 2, 0)) {
            this.type = 'percent_50'
            this.usEstimate = 0
          } else if (this.userStoriesPlaced === this.getFeedbackKey()) {
            this.checkEstimation = true
            this.type = 'task'
            this.usEstimate = 0
          } else if (!(this.usEstimate % 50) && usleft >= 10 && this.usEstimate > 1) {
            this.type = 'breathe'
            this.usEstimate = 0
          }
        }
      },
      getFeedbackKey () {
        return this.round((this.totalGameUserStories * this.feedbackKeyPercent) / 100, 0)
      },
      round (value, decimals) {
        return Number(Math.round(`${value}e${decimals}`) + `e-${decimals}`)
      },
      closeModal () {
        this.type = undefined
      }
    }
  }
</script>

<style lang='css' src='./TgUsFeedback.css'></style>
