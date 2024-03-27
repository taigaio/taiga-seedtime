<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgSetupGameReview.pug'></template>

<script>
  import TgTitle from '@/components/TgTitle/TgTitle'
  import TgReview from '@/components/TgReview/TgReview'

  import locales from '@/translations/translations'

  export default {
    name: 'TgSetupGameReview',
    locales,
    components: {
      TgTitle,
      TgReview
    }
  }
</script>

<style lang='css' src='./TgSetupGameReview.css' scoped></style>
