<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgSetupSelectProject.pug'></template>

<script>
  import TgTitle from '@/components/TgTitle/TgTitle'
  import TgProjectList from '@/components/TgProjectList/TgProjectList'

  import locales from '@/translations/translations'

  export default {
    name: 'TgSetupSelectProject',
    locales,
    components: {
      TgTitle,
      TgProjectList
    }
  }
</script>

<style lang='css' src='./TgSetupSelectProject.css' scoped></style>
