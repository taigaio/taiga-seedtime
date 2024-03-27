<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang="pug" src='./TgRules.pug'></template>

<script>
  import { mapMutations } from 'vuex'

  import TgBackButton from '@/components/TgBackButton/TgBackButton'

  import locales from '@/translations/translations'

  export default {
    name: 'TgRules',
    locales,
    components: {
      TgBackButton
    },
    methods: {
      ...mapMutations({
        setShowRules: 'game/SET_SHOW_RULES'
      })
    },
    created () {
      this.setShowRules(true)
    }
  }
</script>

<style land='css' src='./TgRules.css' scoped></style>
