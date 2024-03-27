/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

import TgAddExistingUs from '@/components/TgAddExistingUs/TgAddExistingUs'
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
        gameUs: {
          157: {
            id: 157,
            ref: 52,
            subject: 'hjkh',
            tags: [],
            status_extra_info: {
              name: 'Nueva',
              color: '#999999',
              is_closed: false
            },
            description_html: '<p>hjkhk</p>',
            is_blocked: false,
            points: {
              13: 25,
              14: 25,
              15: 25,
              16: 25
            },
            total_points: null,
            project: 3,
            version: 1,
            estimates: [
              {
                estimate_value: '1',
                game_name: 'dfgdfg',
                created_date: '2019-07-03T11:20:56.995721+00:00',
                modified_date: '2019-07-03T11:31:53.400743+00:00',
                game_id: 60,
                project_id: 3
              }
            ]
          },
          158: {
            id: 158,
            ref: 53,
            subject: 'nnnn',
            tags: [],
            status_extra_info: {
              name: 'Nueva',
              color: '#999999',
              is_closed: false
            },
            description_html: '<p>nnnn</p>',
            is_blocked: true,
            points: {
              13: 25,
              14: 34,
              15: 25,
              16: 25
            },
            total_points: 13,
            project: 3,
            version: 3,
            estimates: [
              {
                estimate_value: '1',
                game_name: 'dfgdfg',
                created_date: '2019-07-03T11:20:59.428659+00:00',
                modified_date: '2019-07-03T11:31:53.398958+00:00',
                game_id: 60,
                project_id: 3
              }
            ]
          }
        },
        isSelectAllUs: false,
        isBacklogActivated: true,
        isMilestone: false,
        tagsSelected: [],
        statusesSelected: [],
        unselectedUS: [],
        discard: []
      }
    }
  })
}

const getWrapper = (...params) => {
  return mount(
    TgAddExistingUs,
    ...params
  )
}

describe('TgAddExistingUs', () => {
  describe('basic config', () => {
    it('on create', () => {
      const store = getStore()
      const setMilestoneSelected = jest.fn()
      const setDiscardSelected = jest.fn()
      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()
      const getListMilestoneUs = jest.fn()

      const wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          setMilestoneSelected,
          setDiscardSelected,
          getProjectsFilters,
          getTaigaUs,
          getListMilestoneUs
        }
      })

      expect(setMilestoneSelected).toHaveBeenCalledTimes(1)
      expect(setDiscardSelected).toHaveBeenCalledTimes(1)
      expect(getProjectsFilters).toHaveBeenCalledTimes(1)
      expect(getTaigaUs).toHaveBeenCalledTimes(1)
      expect(getListMilestoneUs).toHaveBeenCalledTimes(1)
    })

    it('DOM neither US, nor tags, nor status', () => {
      const store = getStore()

      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()

      const wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          getTaigaUs
        }
      })

      expect(wrapper.find('[data-test="projectName"]').text()).toContain(wrapper.vm.projectData.name)
      expect(wrapper.find('[data-test="projectNumUs"]').text()).toContain(wrapper.vm.numUs)

      expect(wrapper.contains('[data-test="isMilestone"]')).toBe(false)
      expect(wrapper.contains('[data-test="discards"]')).toBe(false)

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
        mocks: {
          $store: store
        },
        methods: {
          getUserStoriesFilters,
          getListUserStories,
          getListMilestoneUs
        }
      })

      await wrapper.vm.getTaigaUs()

      expect(wrapper.contains('[data-test="usNoResults"]')).toBe(false)
      expect(wrapper.contains('[data-test="usResults"]')).toBe(true)
      expect(wrapper.contains('[data-test="spinner"]')).toBe(false)
      expect(wrapper.find('[data-test="addToDeck"]').exists()).toBe(true)

      await wrapper.vm.getProjectsFilters()

      expect(wrapper.contains('[data-test="isMilestone"]')).toBe(true)

      wrapper.vm.showStatuses = true
      expect(wrapper.contains('[data-test="statusesLength"]')).toBe(true)

      wrapper.vm.showTags = true
      expect(wrapper.contains('[data-test="tagsLength"]')).toBe(true)

      store.state.game.discard = [77]
      expect(wrapper.contains('[data-test="discardNumUs"]')).toBe(true)
    })
  })

  describe('check userStories', () => {
    let wrapper, store, totalUs

    beforeEach(() => {
      store = getStore()

      totalUs = 2

      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()

      wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          getTaigaUs
        }
      })

      store.state.game.unselectedUS = []
      wrapper.setData({
        userStories: [
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
        ],
        numUs: totalUs
      })
    })

    it('select all us', () => {
      expect(wrapper.find('[data-test="totalUsSelectedNum"]').text()).toContain(0)
      expect(wrapper.vm.usSelected).toEqual([])

      wrapper.find('[data-test="allUserStoriesSelected"]').setChecked(true)

      expect(store.commit).toHaveBeenCalledWith(
        'game/SET_SELECT_ALL_US',
        true
      )

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
    })
  })

  describe('filters', () => {
    it('Check milestone', () => {
      const store = getStore()

      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()
      const getMilestoneList = jest.fn()
      const setSelectAllUs = jest.fn()

      const wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          getTaigaUs,
          getMilestoneList,
          setSelectAllUs
        }
      })

      wrapper.setData({
        milestone_us: 4
      })

      expect(wrapper.find('[data-test="milestoneNumUs"]').text()).toContain(4)
      wrapper.find('[data-test="milestoneCheckbox"]').setChecked(true)

      expect(store.commit).toHaveBeenCalledWith(
        'game/SET_MILESTONE',
        true
      )
    })

    it('Check discards', () => {
      const store = getStore()

      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()
      const setSelectAllUs = jest.fn()

      const wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          getTaigaUs,
          setSelectAllUs
        }
      })

      store.state.game.discard = [1]

      expect(wrapper.find('[data-test="discardNumUs"]').text()).toContain(1)
      wrapper.find('[data-test="discardsCheckbox"]').setChecked(false)

      expect(store.commit).toHaveBeenCalledWith(
        'game/SET_DISCARD_SELECTED',
        true
      )
    })

    it('Check project filters modal', () => {
      const store = getStore()

      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()

      const wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          getTaigaUs
        }
      })

      wrapper.setData({
        userStories: [
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
        ],
        numUs: 2
      })

      expect(wrapper.find('[data-test="tagsModal"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="statusesModal"]').exists()).toBe(false)

      wrapper.find('[data-test="showStatusesModalButton"]').trigger('click')

      expect(wrapper.find('[data-test="tagsModal"]').exists()).toBe(false)
      expect(wrapper.find('[data-test="statusesModal"]').exists()).toBe(true)

      wrapper.find('[data-test="showTagsModalButton"]').trigger('click')

      expect(wrapper.find('[data-test="tagsModal"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="statusesModal"]').exists()).toBe(false)
    })

    it('remove all filters', () => {
      const store = getStore()

      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()

      const wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          getTaigaUs
        }
      })

      wrapper.setData({
        userStories: [
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
        ],
        numUs: 2
      })

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

    describe('status', () => {
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
          tags: []
        })
      const getTaigaUs = jest.fn()

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
            getTaigaUs
          }
        })

        await wrapper.vm.getTaigaUs()

        wrapper.setData({
          userStories: [
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
          ],
          numUs: 2,
          showStatuses: true
        })

        expect(wrapper.find('[data-test="statusesLength"]').exists()).toBe(true)
        expect(wrapper.findAll('[data-test="statusesList"] li').length).toBe(2)
      })

      it('status length onload', () => {
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

    describe('tag', () => {
      const store = getStore()

      const getUserStoriesFilters = jest.fn()
        .mockReturnValue({
          statuses: [],
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
      const getTaigaUs = jest.fn()

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
            getTaigaUs
          }
        })

        await wrapper.vm.getTaigaUs()

        wrapper.setData({
          userStories: [
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
          ],
          numUs: 2,
          showTags: true
        })

        expect(wrapper.find('[data-test="tagsLength"]').exists()).toBe(true)
        expect(wrapper.findAll('[data-test="tagsList"] li').length).toBe(2)
      })

      it('tag length onload', () => {
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

  describe('modal actions', () => {
    let wrapper, store, addExistingUs

    beforeEach(async () => {
      store = getStore()

      const getProjectsFilters = jest.fn()
      const getTaigaUs = jest.fn()
      addExistingUs = jest.fn()

      wrapper = getWrapper({
        mocks: {
          $store: store
        },
        methods: {
          getProjectsFilters,
          getTaigaUs,
          addExistingUs
        }
      })

      await wrapper.vm.getTaigaUs()
    })

    it('add us to deck', () => {
      wrapper.setData({
        spinner: false,
        usSelected: [1]
      })

      expect(wrapper.contains('[data-test="addToDeck"]:disabled')).toBe(false)

      wrapper.find('[data-test="addToDeck"]').trigger('click')

      expect(addExistingUs).toHaveBeenCalledTimes(1)
    })

    it('close modal', async () => {
      wrapper.find('[data-test="closeModal"]').trigger('click')

      await expect(store.commit).toHaveBeenCalledWith(
        'modal/CLOSE_MODAL')
    })
  })
})
