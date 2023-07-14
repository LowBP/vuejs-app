import { defineStore } from 'pinia'
import http from '@/http-common'
import type {
  IPluginResponseDetail,
  ITabDetail,
  ITabId,
  IPluginCardDetail
} from '@/types/PluginResponseDetail'
import { generateDataPayload } from './-private'

type IState = {
  pluginCardDetails: IPluginCardDetail[]
  pluginResponseDetail: IPluginResponseDetail
  activeTabId: string
  activeTabName: string
  isDisableAllPlugins: boolean
  isGlobalDisableUpdated: boolean
  isLoading: boolean
}

type ITabDetailWithTabId = ITabDetail & ITabId

export const usePluginStore = defineStore('plugin', {
  state: () =>
    ({
      pluginResponseDetail: {},
      isLoading: false,
      activeTabId: '',
      activeTabName: '',
      pluginCardDetails: [] as IPluginCardDetail[],
      isDisableAllPlugins: false,
      isGlobalDisableUpdated: false
    } as IState),
  getters: {
    responseData: (state) => state.pluginResponseDetail,
    plugins: (state) => state.pluginResponseDetail?.plugins,
    tabs: (state) => state.pluginResponseDetail?.tabs,
    tabDetails: (state) => {
      const { tabs, tabdata } = state.pluginResponseDetail
      return (tabs?.map((tabName) => {
        return {
          ...tabdata?.[tabName],
          tabId: tabName
        }
      }) || []) as ITabDetailWithTabId[]
    }
  },
  actions: {
    async getPluginPageDetail() {
      this.isLoading = true
      try {
        const { data } = await http.get('/plugins')
        this.pluginResponseDetail = await data.data
      } catch (error) {
        console.error('Error fetching data:', error)
        if ((error as { code: string }).code === 'ERR_NETWORK') {
          alert('Please run server command in your terminal: ie.. npm run server')
        }
      } finally {
        this.isLoading = false
      }
    },
    postPluginsPageDetail(isToggleDisableAllPlugin: boolean = false) {
      const payload = generateDataPayload({
        pluginResponseDetail: this.pluginResponseDetail,
        activeTabId: this.activeTabId,
        pluginCardDetails: this.pluginCardDetails,
        isDisableAllPlugins: this.isDisableAllPlugins,
        isToggleDisableAllPlugin
      })

      http
        .post('/plugins', { data: payload })
        .then(({ data }) => {
          this.pluginResponseDetail = data.data
          this.isGlobalDisableUpdated = this.isDisableAllPlugins || isToggleDisableAllPlugin
        })
        .catch((error) => {
          console.error(error)
        })
    },
    setActiveTabKey(activeTabId: string) {
      this.activeTabId = activeTabId
    },
    setActiveTabName(activeTabName: string) {
      this.activeTabName = activeTabName
    },
    setGeneratedDetails(data: any) {
      this.pluginCardDetails = data.sort((a: IPluginCardDetail, b: IPluginCardDetail) => {
        return a.title.localeCompare(b.title, 'en', { numeric: true })
      })
    },
    setActiveInactiveState(isActive: boolean, id: string) {
      this.pluginCardDetails = this.pluginCardDetails.map((card) => {
        if (card.id === id) {
          if (isActive) {
            card.isActive = true
            card.isInactive = false
            return card
          }
          card.isActive = false
          card.isInactive = true
        }
        return card
      })
    },
    setIsDisableAllPluginState(isDisabledAll: boolean) {
      this.isDisableAllPlugins = isDisabledAll
    }
  }
})
