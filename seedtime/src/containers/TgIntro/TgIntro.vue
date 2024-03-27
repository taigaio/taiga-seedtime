<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang="pug" src='./TgIntro.pug'></template>

<script>
  import { authService } from '@/api'
  import locales from '@/translations/translations'

  export default {
    name: 'TgIntro',
    locales,
    beforeRouteEnter (to, from, next) {
      if (authService.intro.get()) {
        return next({
          name: 'setupSelectProject'
        })
      }

      return next()
    },
    created () {
      authService.intro.set()
    }
  }
</script>

<style land='css' src='./TgIntro.css' scoped></style>
