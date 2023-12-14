<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgPoints.pug'></template>

<script>
  import { mapActions } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'

  export default {
    name: 'TgPoints',
    components: {
      TgButton
    },
    data () {
      return {
        pointSelected: undefined,
        pointPosition: {
          height: 0,
          top: 0
        }
      }
    },
    props: {
      userStoryId: {
        type: Number,
        required: true
      },
      points: {
        type: Array,
        default: [],
        required: true
      },
      position: {
        type: Object,
        default: {
          top: 0,
          left: 0
        },
        required: true
      },
      roleId: {
        type: Number,
        default: undefined,
        required: true
      }
    },
    computed: {
      positionTop () {
        return this.position.top - this.pointPosition.height
      }
    },
    mounted () {
      let pointRef = this.$refs.points.getBoundingClientRect()
      this.pointPosition.height = pointRef.height
    },
    methods: {
      ...mapActions({
        setNewtPoint: 'game/setNewtPoint'
      }),
      vote (pointId) {
        this.setNewtPoint({
          userStoryId: this.userStoryId,
          roleId: this.roleId,
          pointId: pointId
        })
      }
    }
  }
</script>

<style lang='css' src='./TgPoints.css' scoped></style>
