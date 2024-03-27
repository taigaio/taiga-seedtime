<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos INC
-->

<template lang='pug' src='./TgProject.pug'></template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'

  import TgButton from '@/components/TgButton/TgButton'
  import murmurhash from 'murmurhash-js'

  export default {
    name: 'TgProject',
    components: {
      TgButton
    },
    props: {
      id: {
        type: Number,
        required: true
      },
      slug: {
        type: String,
        required: true
      },
      logo: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: undefined,
        required: false
      },
      private: {
        type: Boolean,
        default: false,
        required: false
      },
      permissions: {
        type: Array,
        default: [],
        required: true
      }
    },
    computed: {
      ...mapState({
        projectData: state => state.game.projectData
      }),
      ...mapGetters({
        getDefaultImages: 'game/getProjectDefaultImage'
      }),
      defaultImage () {
        const key = `${this.slug}-${this.id}`
        const murmurId = murmurhash(key, 42) % this.getDefaultImages.length
        const logo = this.getDefaultImages[murmurId]
        return {
          color: logo[0],
          src: require(`../../../static/img/project-logos/${logo[1]}`)
        }
      }
    },
    methods: {
      ...mapMutations({
        setProjectData: 'game/SET_PROJECT_DATA'
      }),
      selectProject () {
        this.setProjectData({
          id: this.id,
          name: this.name,
          slug: this.slug,
          permissions: this.permissions
        })
        return this.$router.push({ name: 'setupGameData' })
      },
      isActive () {
        return this.projectData.id === this.id
      }
    }
  }
</script>

<style lang='css' src='./TgProject.css' scoped></style>
