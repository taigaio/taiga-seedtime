<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang="pug" src='./TgBackButton.pug'></template>

<script>
  import TgButton from '@/components/TgButton/TgButton'

  import locales from '@/translations/translations'

  export default {
    name: 'TgBackButton',
    locales,
    components: {
      TgButton
    }
  }
</script>

<style land='css' src='./TgBackButton.css' scoped></style>
