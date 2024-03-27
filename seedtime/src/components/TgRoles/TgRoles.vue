<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgRoles.pug'></template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import TgPoints from '@/components/TgPoints/TgPoints'

  export default {
    name: 'TgRoles',
    data () {
      return {
        showPoints: {
          show: false,
          roleId: undefined,
          position: {
            top: 0,
            left: 0
          }
        }
      }
    },
    props: {
      userStoryId: {
        type: Number,
        required: true
      }
    },
    components: {
      TgPoints
    },
    created () {
      this.getUserStory()
    },
    computed: {
      ...mapState({
        roles: state => state.game.roles,
        points: state => state.game.points
      }),
      ...mapGetters({
        getUserStory: 'game/getUserStory'
      })
    },
    methods: {
      close () {
        this.showPoints.show = false
        const PREVIOUS_SELECTED = this.$el.querySelector('.selected')

        if (PREVIOUS_SELECTED) {
          PREVIOUS_SELECTED.classList.remove('selected')
        }
      },
      togglePoints (roleId, event) {
        if (this.showPoints.roleId === roleId && this.showPoints.show) {
          this.showPoints.show = false
        } else {
          this.showPoints.show = true
          if (this.showPoints.show) {
            this.preparePoints(roleId, event)
          }
        }
      },
      preparePoints (roleId, event) {
        const $el = event.target

        $el.classList.add('selected')

        this.showPoints.show = true

        let estimationRole = $el.getBoundingClientRect()
        let estimationBox = this.$el.querySelector('.estimation').getBoundingClientRect()

        let top = estimationRole.top - estimationBox.top
        let left = estimationRole.left - estimationBox.left
        const halfWidth = estimationRole.width / 2
        this.showPoints.position.top = top
        this.showPoints.position.left = left - halfWidth
        this.showPoints.roleId = roleId
      },
      point (roleId) {
        let pointList = this.getUserStory(this.userStoryId)
        if (pointList) {
          let pointId = pointList.points[roleId]
          let point = this.points.find(item => item.id === pointId)
          if (point && point.name) {
            return point.name
          }
        }
        return '-'
      }
    }
  }
</script>

<style lang='css' src='./TgRoles.css' scoped></style>
