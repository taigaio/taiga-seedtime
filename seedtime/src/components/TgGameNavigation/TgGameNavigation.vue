<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgGameNavigation.pug'></template>

<script>
  import { mapState } from 'vuex'

  import locales from '@/translations/translations'

  export default {
    name: 'TgGameNavigation',
    locales,
    data () {
      return {}
    },
    computed: {
      ...mapState({
        getProjectData: state => state.game.projectData,
        getGameUUID: state => state.game.uuid
      })
    }
  }
</script>

<style lang='css' src='./TgGameNavigation.css' scoped></style>
