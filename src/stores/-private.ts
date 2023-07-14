import type {
  IPluginCardDetail,
  IPluginResponseDetail,
  ITabData
} from '@/types/PluginResponseDetail'

type ITabDataInput = {
  pluginResponseDetail: IPluginResponseDetail
  activeTabId: string
  pluginCardDetails: IPluginCardDetail[]
  isDisableAllPlugins: boolean
  isToggleDisableAllPlugin: boolean
}
export function generateDataPayload({
  pluginResponseDetail,
  activeTabId,
  pluginCardDetails,
  isDisableAllPlugins,
  isToggleDisableAllPlugin
}: ITabDataInput) {
  const tabdata: ITabData = {
    ...pluginResponseDetail.tabdata,
    [activeTabId]: {
      ...pluginResponseDetail.tabdata[activeTabId],
      active: pluginCardDetails.filter((card) => card.isActive).map((card) => card.id),
      disabled: pluginCardDetails.filter((card) => card.isDisabled).map((card) => card.id),
      inactive: pluginCardDetails.filter((card) => card.isInactive).map((card) => card.id)
    }
  }

  if (isDisableAllPlugins || isToggleDisableAllPlugin) {
    for (const key in tabdata) {
      if (tabdata[key]) {
        tabdata[key]['disabled'] = isDisableAllPlugins
          ? [...tabdata[key]['active'], ...tabdata[key]['disabled'], ...tabdata[key]['inactive']]
          : []
      }
    }
  }

  return {
    tabs: pluginResponseDetail.tabs,
    plugins: pluginResponseDetail.plugins,
    tabdata
  }
}
