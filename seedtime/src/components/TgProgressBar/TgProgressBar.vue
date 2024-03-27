<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgProgressBar.pug'></template>

<script>
  import { mapGetters } from 'vuex'

  import locales from '@/translations/translations'

  export default {
    name: 'TgProgressBar',
    locales,
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        userStoriesPlaced: 'game/getTotalPlaced',
        totalGameUserStories: 'game/totalGameUserStories'
      }),
      total () {
        return this.percentageProgresion(this.userStoriesPlaced)
      }
    },
    methods: {
      percentageProgresion (userStories) {
        return (userStories * 100) / this.totalGameUserStories
      }
    }
  }
</script>

<style lang='css' src='./TgProgressBar.css' scoped></style>
