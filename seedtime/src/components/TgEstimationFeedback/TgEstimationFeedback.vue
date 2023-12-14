<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgEstimationFeedback.pug'></template>

<script>
  import { mapState } from 'vuex'

  import locales from '@/translations/translations'

  import TgButton from '@/components/TgButton/TgButton'

  export default {
    name: 'TgEstimationFeedback',
    locales,
    components: {
      TgButton
    },
    props: {
      place: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        feedbackScale: ['small', 'medium', 'big'],
        groupsNumber: 3,
        amountUs: [],
        maxAmount: {
          group: 0,
          amount: 0
        },
        breakMacedonia: 75,
        fibonacci: [0.5, 1, 2, 3, 5, 8, 13, 21, 30, 50, 100, 200],
        modalOpen: false
      }
    },
    created () {
      this.maxScaleFibonacci()

      if (this.place === 'board') {
        this.modalOpen = true
      }
    },
    watch: {
      scales () {
        this.maxScaleFibonacci()
      }
    },
    computed: {
      ...mapState({
        scales: state => state.game.scale
      }),
      getFeedback () {
        let winner = this.amountUs.filter(current => {
          if ((current.amount * 100) / this.maxAmount.amount >= this.breakMacedonia) {
            return current
          }
          return false
        })

        let feedbackText = ''
        if (winner.length === 3) {
          feedbackText = 'equilibrate'
        } else {
          for (let i = 0; i < winner.length; i++) {
            if (winner[i].group === 1) {
              feedbackText += this.feedbackScale[0]
            } else if (winner[i].group === 2) {
              if (i > 0) {
                feedbackText += '_'
              }
              feedbackText += this.feedbackScale[1]
            } else if (winner[i].group === 3) {
              if (i > 0) {
                feedbackText += '_'
              }
              feedbackText += this.feedbackScale[2]
            }
          }
        }
        return feedbackText
      }
    },
    methods: {
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
          // max us' scale relative value
          return Math.max(acc, Object.keys(current.cards).length * this.fibonacci[index])
        }, 0)
      },
      isBoardFeedback () {
        return this.feedbackScale.includes(this.getFeedback)
      },
      closeModal () {
        this.modalOpen = false
      }
    }
  }
</script>

<style lang='css' src='./TgEstimationFeedback.css' scoped></style>
