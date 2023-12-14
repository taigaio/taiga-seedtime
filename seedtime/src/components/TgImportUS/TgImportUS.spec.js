/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import TgImportUS from '@/components/TgImportUS/TgImportUS'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'

const getStore = () => {
  return new Store({
    state: {
      game: {
        projectData: {
          id: 4,
          name: 'Project Example 3',
          slug: 'project-3',
          permissions: []
        },
        userStories: [
          { id: 94 },
          { id: 95 },
          { id: 96 },
          { id: 97 }
        ],
        isSelectAllUs: false,
        isBacklogActivated: true,
        isMilestone: false,
        tagsSelected: [],
        statusesSelected: [],
        unselectedUS: []
      }
    }
  })
}

const getWrapper = (...params) => {
  return mount(
    TgImportUS,
    ...params
  )
}

describe('TgImportUS', () => {
  describe('basic config', () => {
    it('on create', () => {
      const store = getStore()
      const getProjectsFilters = jest.fn()
      const readUsSelected = jest.fn()
      const getTaigaUs = jest.fn()
      const getListMilestoneUs = jest.fn()

      const wrapper = getWrapper({
        stubs: {
          TgNextStep: true
        },
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          readUsSelected,
          getTaigaUs,
          getListMilestoneUs
        }
      })

      expect(getProjectsFilters).toHaveBeenCalledTimes(1)
      expect(getListMilestoneUs).toHaveBeenCalledTimes(1)
      expect(wrapper.contains('[data-test="TgNextStep"]')).toBe(true)
    })

    it('DOM neither US, nor tags, nor status', () => {
      const store = getStore()
      const getProjectsFilters = jest.fn()
      const readUsSelected = jest.fn()
      const getTaigaUs = jest.fn()
      const getListMilestoneUs = jest.fn()

      const wrapper = getWrapper({
        stubs: {
          TgNextStep: true
        },
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          readUsSelected,
          getTaigaUs,
          getListMilestoneUs
        }
      })

      expect(wrapper.find('[data-test="projectName"]').text()).toContain(wrapper.vm.projectData.name)
      expect(wrapper.find('[data-test="projectNumUs"]').text()).toContain(wrapper.vm.numUs)

      expect(wrapper.contains('[data-test="isMilestone"]')).toBe(false)
      expect(wrapper.find('[data-test="totalUsSelectedNum"]').text()).toContain(wrapper.vm.totalUsSelected)
      expect(wrapper.contains('[data-test="filterSelected"]')).toBe(false)

      expect(wrapper.contains('[data-test="statusesModal"]')).toBe(false)
      wrapper.vm.showStatuses = true
      expect(wrapper.contains('[data-test="statusesLength"]')).toBe(false)

      expect(wrapper.contains('[data-test="tagsModal"]')).toBe(false)
      wrapper.vm.showTags = true
      expect(wrapper.contains('[data-test="tagsLength"]')).toBe(false)

      expect(wrapper.contains('[data-test="usNoResults"]')).toBe(true)
      expect(wrapper.contains('[data-test="usResults"]')).toBe(false)
      expect(wrapper.contains('[data-test="spinner"]')).toBe(true)
    })

    it('DOM with data', async () => {
      const store = getStore()

      const readUsSelected = jest.fn()
      const getListMilestoneUs = jest.fn()
          .mockReturnValue(4)
      const getUserStoriesFilters = jest.fn()
        .mockReturnValue({
          statuses: [
            {
              id: 13,
              name: 'New',
              color: '#999999',
              order: 1,
              count: 36
            },
            {
              id: 14,
              name: 'Ready',
              color: '#ff8a84',
              order: 2,
              count: 6
            }
          ],
          tags: [
            {
              name: 'asperiores',
              color: '#a69134',
              count: 1
            }, {
              name: 'assumenda',
              color: null,
              count: 1
            }
          ]
        })

      const getListUserStories = jest.fn()
        .mockReturnValue({
          count: 2,
          items: [
            {
              id: 77,
              ref: 10,
              subject: 'Feature/improved image admin2',
              tags: [
                  ['mollitia', '#002e7f'],
                  ['molestias', null]
              ],
              status_extra_info: {
                name: 'Ready for test',
                color: '#fcc000',
                is_closed: false
              },
              is_blocked: false,
              project: 3,
              version: 26
            },
            {
              id: 78,
              ref: 11,
              subject: 'Create testsuite with matrix builds',
              tags: [
                ['possimus', '#fccc1b'],
                ['asperiores', '#a69134'],
                ['hic', null]
              ],
              status_extra_info: {
                name: 'In progress',
                color: '#ff9900',
                is_closed: false
              },
              is_blocked: true,
              project: 3,
              version: 9
            }
          ]
        })

      const wrapper = getWrapper({
        stubs: {
          TgNextStep: true
        },
        mocks: {
          $store: store
        },
        methods: {
          getUserStoriesFilters,
          readUsSelected,
          getListMilestoneUs,
          getListUserStories
        }
      })

      await wrapper.vm.getTaigaUs()

      expect(wrapper.contains('[data-test="usNoResults"]')).toBe(false)
      expect(wrapper.contains('[data-test="usResults"]')).toBe(true)
      expect(wrapper.contains('[data-test="spinner"]')).toBe(false)

      await wrapper.vm.getProjectsFilters()

      wrapper.vm.showStatuses = true
      expect(wrapper.contains('[data-test="statusesLength"]')).toBe(true)

      wrapper.vm.showTags = true
      expect(wrapper.contains('[data-test="tagsLength"]')).toBe(true)

      expect(wrapper.contains('[data-test="isMilestone"]')).toBe(true)
    })
  })

  describe('check userStories', () => {
    const store = getStore()

    const totalUs = 2
    const getUserStoriesFilters = jest.fn()
      .mockReturnValue({
        statuses: [],
        tags: []
      })
    const readUsSelected = jest.fn()
    const getListMilestoneUs = jest.fn()
        .mockReturnValue(4)
    const getListUserStories = jest.fn()
      .mockReturnValue({
        count: totalUs,
        items: [
          {
            id: 77,
            ref: 10,
            subject: 'Feature/improved image admin2',
            tags: [
                ['mollitia', '#002e7f'],
                ['molestias', null]
            ],
            status_extra_info: {
              name: 'Ready for test',
              color: '#fcc000',
              is_closed: false
            },
            is_blocked: false,
            project: 3,
            version: 26
          },
          {
            id: 78,
            ref: 11,
            subject: 'Create testsuite with matrix builds',
            tags: [
              ['possimus', '#fccc1b'],
              ['asperiores', '#a69134'],
              ['hic', null]
            ],
            status_extra_info: {
              name: 'In progress',
              color: '#ff9900',
              is_closed: false
            },
            is_blocked: true,
            project: 3,
            version: 9
          }
        ]
      })

    let wrapper

    beforeEach(async () => {
      wrapper = getWrapper({
        stubs: {
          TgNextStep: true
        },
        mocks: {
          $store: store
        },
        methods: {
          getUserStoriesFilters,
          readUsSelected,
          getListMilestoneUs,
          getListUserStories
        }
      })

      await wrapper.vm.getTaigaUs()
    })

    it('select all us', () => {
      expect(wrapper.find('[data-test="totalUsSelectedNum"]').text()).toContain(0)
      expect(wrapper.vm.usSelected).toEqual([])

      wrapper.find('[data-test="allUserStoriesSelected"]').setChecked(true)

      expect(wrapper.find('[data-test="totalUsSelectedNum"]').text()).toContain(totalUs)
      expect(wrapper.vm.usSelected).toEqual([wrapper.vm.userStories[0].id, wrapper.vm.userStories[1].id])
    })

    it('select one us', async () => {
      expect(wrapper.find('[data-test="totalUsSelectedNum"]').text()).toContain(0)
      expect(wrapper.vm.usSelected).toEqual([])

      wrapper.find(`[data-test="usCheckbox${wrapper.vm.userStories[0].id}"]`).setChecked(true)

      expect(wrapper.find('[data-test="totalUsSelectedNum"]').text()).toContain(1)
      expect(wrapper.vm.usSelected).toEqual([wrapper.vm.userStories[0].id])

      await expect(store.commit).toHaveBeenCalledWith(
        'game/SET_SELECT_ALL_US',
        false
      )
      await expect(store.commit).toHaveBeenCalledWith(
        'game/SET_USER_STORIES',
        [{ id: wrapper.vm.userStories[0].id }]
      )
      await expect(store.commit).toHaveBeenCalledWith(
        'game/SET_UNSELECTED_US',
        [wrapper.vm.userStories[1].id]
      )
      await expect(store.commit).toHaveBeenCalledWith(
        'step/SET_COMPLETE',
        wrapper.vm.usSelected.length
      )
    })
  })

  describe('filters', () => {
    const store = getStore()

    const getUserStoriesFilters = jest.fn()
      .mockReturnValue({
        statuses: [
          {
            id: 1,
            name: 'Nueva',
            color: '#999999',
            order: 1,
            count: 41
          }, {
            id: 4,
            name: 'Lista para testear',
            color: null,
            order: 4,
            count: 1
          }
        ],
        tags: [
          {
            name: 'accusantium',
            color: '#b36f86',
            count: 1
          }, {
            name: 'aliquid',
            color: null,
            count: 1
          }
        ]
      })
    const readUsSelected = jest.fn()
    const getListMilestoneUs = jest.fn()
      .mockReturnValue(4)
    const getListUserStories = jest.fn()
      .mockReturnValue({
        count: 2,
        items: [
          {
            id: 77,
            ref: 10,
            subject: 'Feature/improved image admin2',
            tags: [
                ['mollitia', '#002e7f'],
                ['molestias', null]
            ],
            status_extra_info: {
              name: 'Ready for test',
              color: '#fcc000',
              is_closed: false
            },
            is_blocked: false,
            project: 3,
            version: 26
          },
          {
            id: 78,
            ref: 11,
            subject: 'Create testsuite with matrix builds',
            tags: [
              ['possimus', '#fccc1b'],
              ['asperiores', '#a69134'],
              ['hic', null]
            ],
            status_extra_info: {
              name: 'In progress',
              color: '#ff9900',
              is_closed: false
            },
            is_blocked: true,
            project: 3,
            version: 9
          }
        ]
      })

    let wrapper

    beforeEach(async () => {
      wrapper = getWrapper({
        stubs: {
          TgNextStep: true
        },
        mocks: {
          $store: store
        },
        methods: {
          getUserStoriesFilters,
          readUsSelected,
          getListMilestoneUs,
          getListUserStories
        }
      })

      await wrapper.vm.getTaigaUs()
    })

    it('Check milestone', () => {
      wrapper.find('[data-test="milestoneCheckbox"]').setChecked(true)

      expect(store.commit).toHaveBeenCalledWith(
        'game/SET_MILESTONE',
        true
      )
      expect(getListUserStories).toHaveBeenCalled()
    })

    it('Check project filters modal', () => {
      expect(wrapper.find('[data-test="tagsModal"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="statusesModal"]').exists()).toBe(false)

      wrapper.find('[data-test="showStatusesModalButton"]').trigger('click')

      expect(wrapper.find('[data-test="tagsModal"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="statusesModal"]').exists()).toBe(true)

      wrapper.find('[data-test="showTagsModalButton"]').trigger('click')

      expect(wrapper.find('[data-test="tagsModal"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="statusesModal"]').exists()).toBe(false)
    })

    describe('status', () => {
      beforeEach(() => {
        wrapper.setData({
          showStatuses: true
        })

        expect(wrapper.find('[data-test="statusesLength"]').exists()).toBe(true)
        expect(wrapper.findAll('[data-test="statusesList"] li').length).toBe(2)
      })

      it('Check status length onload', () => {
        expect(wrapper.vm.pendingStatusesSelected).toEqual([1, 4])
        expect(wrapper.vm.statusesSelected).toEqual([])
      })

      it('save one status', async () => {
        wrapper.find('[data-test="allStatusesSelected"]').setChecked(false)
        wrapper.find(`[data-test="statusCheckbox${wrapper.vm.statuses[0].id}"]`).setChecked(true)

        wrapper.find('[data-test="saveStatusesButton"]').trigger('click')

        await expect(store.commit).toHaveBeenCalledWith(
          'game/SET_STATUSES_SELECTED',
          wrapper.vm.statusesSelected
          )

        expect(
          wrapper.find(`[data-test="filterStatusSelected${wrapper.vm.statusesSelectedList[0].id}"]`
          ).exists()).toBe(true)

        expect(wrapper.find('[data-test="statusesModal"]').exists()).toBe(false)
      })

      it('remove color status filter', () => {
        wrapper.setData({
          statusesSelected: [1],
          statusesSelectedList: [
            {
              color: '#999999',
              id: 1,
              name: 'Nueva',
              order: 1
            }
          ]
        })

        const statusItemId = wrapper.vm.statusesSelectedList[0].id

        expect(
          wrapper.find(`[data-test="filterStatusSelected${statusItemId}"]`
          ).exists()).toBe(true)

        wrapper.find('[data-test="removeFilterStatusColor"]').trigger('click')

        expect(
          wrapper.find(`[data-test="filterStatusSelected${statusItemId}"]`
          ).exists()).toBe(false)
      })

      it('remove none color status filter', () => {
        wrapper.setData({
          statusesSelected: [4],
          statusesSelectedList: [
            {
              id: 4,
              name: 'Lista para testear',
              color: null,
              order: 4,
              count: 1
            }
          ]
        })

        const statusItemId = wrapper.vm.statusesSelectedList[0].id

        expect(
          wrapper.find(`[data-test="filterStatusSelected${statusItemId}"]`
          ).exists()).toBe(true)

        wrapper.find('[data-test="removeFilterStatusNoneColor"]').trigger('click')

        expect(
          wrapper.find(`[data-test="filterStatusSelected${statusItemId}"]`
          ).exists()).toBe(false)
      })
    })

    describe('tags', () => {
      beforeEach(() => {
        wrapper.setData({
          showTags: true
        })

        expect(wrapper.find('[data-test="tagsLength"]').exists()).toBe(true)
        expect(wrapper.findAll('[data-test="tagsList"] li').length).toBe(2)
      })

      it('Check tags length onload', () => {
        expect(wrapper.vm.pendingTagsSelected).toEqual(['accusantium', 'aliquid'])
        expect(wrapper.vm.tagsSelected).toEqual([])
      })

      it('save one tag', async () => {
        wrapper.find('[data-test="allTagsSelected"]').setChecked(false)
        wrapper.find(`[data-test="tagCheckbox${wrapper.vm.tags[0].name}"]`).setChecked(true)

        wrapper.find('[data-test="saveTagsButton"]').trigger('click')

        await expect(store.commit).toHaveBeenCalledWith(
          'game/SET_TAGS_SELECTED',
          wrapper.vm.tagsSelected
          )

        expect(
          wrapper.find(`[data-test="filterTagsSelected${wrapper.vm.tagsSelectedList[0].name}"]`
          ).exists()).toBe(true)

        expect(wrapper.find('[data-test="tagsModal"]').exists()).toBe(false)
      })

      it('remove color tag filter', () => {
        wrapper.setData({
          tagsSelected: ['accusantium'],
          tagsSelectedList: [
            {
              name: 'accusantium',
              color: '#b36f86',
              count: 1
            }
          ]
        })

        const tagItemId = wrapper.vm.tagsSelectedList[0].name

        expect(
          wrapper.find(`[data-test="filterTagsSelected${tagItemId}"]`
          ).exists()).toBe(true)

        wrapper.find('[data-test="removeFilterTagColor"]').trigger('click')

        expect(
          wrapper.find(`[data-test="filterTagsSelected${tagItemId}"]`
          ).exists()).toBe(false)
      })

      it('remove none color tag filter', () => {
        wrapper.setData({
          tagsSelected: ['aliquid'],
          tagsSelectedList: [
            {
              name: 'aliquid',
              color: null,
              count: 1
            }
          ]
        })

        const tagItemId = wrapper.vm.tagsSelectedList[0].name

        expect(
          wrapper.find(`[data-test="filterTagsSelected${tagItemId}"]`
          ).exists()).toBe(true)

        wrapper.find('[data-test="removeFilterTagNoneColor"]').trigger('click')

        expect(
          wrapper.find(`[data-test="filterTagsSelected${tagItemId}"]`
          ).exists()).toBe(false)
      })
    })

    it('remove all filters', () => {
      // tags //
      wrapper.setData({
        tagsSelected: ['accusantium'],
        tagsSelectedList: [
          {
            name: 'accusantium',
            color: '#b36f86',
            count: 1
          }
        ]
      })

      const tagItemId = wrapper.vm.tagsSelectedList[0].name

      expect(
        wrapper.find(`[data-test="filterTagsSelected${tagItemId}"]`
        ).exists()).toBe(true)

      // status //
      wrapper.setData({
        statusesSelected: [1],
        statusesSelectedList: [
          {
            color: '#999999',
            id: 1,
            name: 'Nueva',
            order: 1
          }
        ]
      })

      const statusItemId = wrapper.vm.statusesSelectedList[0].id

      expect(
        wrapper.find(`[data-test="filterStatusSelected${statusItemId}"]`
        ).exists()).toBe(true)

      // all //
      wrapper.find('[data-test="removeAllFiltersButton"]').trigger('click')

      expect(
        wrapper.find(`[data-test="filterTagsSelected${tagItemId}"]`
        ).exists()).toBe(false)
      expect(
        wrapper.find(`[data-test="filterStatusSelected${statusItemId}"]`
        ).exists()).toBe(false)
    })
  })

  describe('load more on scroll', () => {
    const store = getStore()

    const readUsSelected = jest.fn()
    const getListMilestoneUs = jest.fn()
        .mockReturnValue(4)

    const getUserStoriesFilters = jest.fn()
      .mockReturnValue({
        statuses: [],
        tags: []
      })

    const getListUserStories = jest.fn()
      .mockReturnValue({
        count: 2,
        items: [
          {
            id: 77,
            ref: 10,
            subject: 'Feature/improved image admin2',
            tags: [
                ['mollitia', '#002e7f'],
                ['molestias', null]
            ],
            status_extra_info: {
              name: 'Ready for test',
              color: '#fcc000',
              is_closed: false
            },
            is_blocked: false,
            project: 3,
            version: 26
          },
          {
            id: 78,
            ref: 11,
            subject: 'Create testsuite with matrix builds',
            tags: [
              ['possimus', '#fccc1b'],
              ['asperiores', '#a69134'],
              ['hic', null]
            ],
            status_extra_info: {
              name: 'In progress',
              color: '#ff9900',
              is_closed: false
            },
            is_blocked: true,
            project: 3,
            version: 9
          }
        ]
      })

    let spy, wrapper

    beforeEach(() => {
      wrapper = getWrapper({
        stubs: {
          TgNextStep: true
        },
        mocks: {
          $store: store
        },
        methods: {
          getUserStoriesFilters,
          readUsSelected,
          getListMilestoneUs,
          getListUserStories
        }
      })
    })

    it('pagination', () => {
      spy = jest.spyOn(wrapper.vm, 'getTaigaUs')

      wrapper.setData({
        numUs: 3,
        bottom: true
      })

      expect(spy).toBeCalled()

      spy.mockClear()
    })

    it('no pagination', () => {
      spy = jest.spyOn(wrapper.vm, 'getTaigaUs')

      wrapper.setData({
        numUs: 2,
        bottom: true
      })

      expect(spy).not.toBeCalled()

      spy.mockClear()
    })
  })
})
