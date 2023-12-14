<!--
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) 2021-present Kaleidos Ventures SL
-->

<template lang='pug' src='./TgProjectList.pug'></template>

<script>
  // Import npm components
  import { mapState, mapMutations, mapActions } from 'vuex'
  import locales from '@/translations/translations'

  // Import components to use in layout
  import TgProject from '@/components/TgProject/TgProject'

  export default {
    name: 'TgProjectList',
    locales,
    components: {
      TgProject
    },
    data () {
      return {
        projects: []
      }
    },
    computed: {
      ...mapState({
        me: state => state.user.me
      })
    },
    created () {
      this.getProjects()
    },
    methods: {
      ...mapMutations({
        openModal: 'modal/OPEN_MODAL',
        closeModal: 'modal/CLOSE_MODAL',
        notifyText: 'modal/NOTIFY_TEXT'
      }),
      ...mapActions({
        getProjectList: 'game/getProjectList',
        checkProjecttUserStories: 'game/checkProjecttUserStories'
      }),
      async getProjects () {
        try {
          const list = await this.getProjectList(this.me.id)
          if (list.length < 1) {
            this.closeModal()
            this.notifyText({text: 'PROJECT_NOT_FOUND', error: true})
            this.openModal('notify')
          } else {
            for (var i in list) {
              this.checkProjecttUserStories(list[i].id)
                .then(us => {
                  if (us && us.length > 0) {
                    this.projects.push(list.find(project => project.id === us[0].project))
                  }
                  this.projects.sort((a, b) => {
                    let dateA = new Date(a.modified_date)
                    let dateB = new Date(b.modified_date)
                    return (dateA.getTime() < dateB.getTime()) ? 1 : -1
                  })
                  return true
                })
                .catch(error => {
                  console.error(error)
                  this.closeModal()
                  this.notifyText({text: 'ERROR_TEXT', error: true})
                  this.openModal('notify')
                })
            }
          }
        } catch (error) {
          if (error === 401) {
            this.$router.push({name: 'login'})
          }
        }
      }
    }
  }
</script>

<style lang='css' src='./TgProjectList.css' scoped></style>
