<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgSummary.pug'></template>

<script>
  import Vue from 'vue'
  import { mapState, mapGetters } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'
  import TgProgressBar from '@/components/TgProgressBar/TgProgressBar'
  import TgEstimationFeedback from '@/components/TgEstimationFeedback/TgEstimationFeedback'

  import locales from '@/translations/translations'

  export default {
    name: 'TgSummary',
    locales,
    components: {
      TgButton,
      TgProgressBar,
      TgEstimationFeedback
    },
    data () {
      return {
        copied: false,
        baseUrl: Vue.config.estimations.BASE_URL,
        taigaUrl: Vue.config.estimations.TAIGA_FRONT,
        columns: 3,
        groupsNumber: 3,
        amountUs: [],
        maxAmount: {
          group: 0,
          amount: 0
        },
        fibonacci: [0.5, 1, 2, 3, 5, 8, 13, 21, 30, 50, 100, 200]
      }
    },
    computed: {
      ...mapState({
        scales: state => state.game.scale,
        name: state => state.game.name,
        projectData: state => state.game.projectData,
        gameUUID: state => state.game.uuid
      }),
      ...mapGetters({
        userStoriesPlaced: 'game/getTotalPlaced',
        totalGameUserStories: 'game/totalGameUserStories'
      }),
      total () {
        return this.percentageProgresion(this.userStoriesPlaced)
      },
      projectRoute () {
        return `${this.taigaUrl}project/${this.projectData.slug}`
      },
      gameUrl () {
        return `${this.baseUrl}game/${this.projectData.slug}/${this.gameUUID}`
      },
      maxScaleFibonacci () {
        let breakPoint = this.scales.length / this.groupsNumber
        let totalAmount = 0
        let iteration = breakPoint
        let group = 0

        return this.scales.reduce((acc, current, index) => {
          // group division with no decimals number
          if (Number(iteration.toFixed(2)) >= 1) {
            totalAmount += current.cards.length * this.fibonacci[index]

            if (Number(iteration.toFixed(2)) === 1) {
              group++
              if (totalAmount > this.maxAmount.amount) {
                this.maxAmount.group = group
                this.maxAmount.amount = totalAmount
              }
              this.amountUs.push({
                group,
                amount: totalAmount
              })
              totalAmount = 0
              iteration = breakPoint
            } else {
              iteration--
            }
          } else { // with decimals
            totalAmount += current.cards.length * iteration * this.fibonacci[index]
            group++
            if (totalAmount > this.maxAmount.amount) {
              this.maxAmount.group = group
              this.maxAmount.amount = totalAmount
            }
            this.amountUs.push({
              group,
              amount: totalAmount
            })
            let iterationLeft = 1 - iteration
            totalAmount = current.cards.length * iterationLeft * this.fibonacci[index]
            iteration = breakPoint - iterationLeft
          }
          // saca el valor máximo de US en una escala
          return Math.max(acc, Object.keys(current.cards).length * this.fibonacci[index])
        }, 0)
      },
      maxScaleReal () {
        return this.scales.reduce((acc, current, index) => {
          if (current.cards.length > acc) {
            return current.cards.length
          } else {
            return acc
          }
        }, 0)
      }
    },
    methods: {
      percentageProgresion (userStories) {
        return (userStories * 100) / this.totalGameUserStories
      },
      percentageScales (userStories, index) {
        return (userStories * this.fibonacci[index] * 100) / this.maxScaleFibonacci
      },
      minHeightScale (numCards, index) {
        if (numCards > 0) {
          let heightPercent = this.percentageScales(numCards, index)
          if (heightPercent < '1.5') {
            return '1.5'
          }
          return heightPercent
        } else {
          return numCards
        }
      },
      realScale (numCards) {
        return ((numCards * 100) / this.maxScaleReal)
      },
      copy () {
        this.$refs.copyLink.select()
        document.execCommand('copy')
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
      }
    }
  }
</script>

<style lang='css' src='./TgSummary.css' scoped></style>
