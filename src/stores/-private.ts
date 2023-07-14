import type {
  IPluginCardDetail,
  IPluginResponseDetail,
  ITabData
} from '@/types/PluginResponseDetail'
import { usePluginStore, type ITabDetailWithTabId } from './plugin'
import { storeToRefs } from 'pinia'

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

export function checkIsDisabledPlugin(disabledPlugins: string[], name: string) {
  const disabledPluginIndex = disabledPlugins.indexOf(name)
  const isDisabled = disabledPluginIndex > -1
  if (isDisabled) {
    disabledPlugins.splice(disabledPluginIndex, 1)
  }

  return isDisabled
}

export function generatePluginCardDetails(selectedTabDetail: ITabDetailWithTabId) {
  const store = usePluginStore()
  const { tabDetails } = storeToRefs(store)

  const generatedPluginDetails: IPluginCardDetail[] = []
  if (selectedTabDetail) {
    const { active, disabled, inactive } = selectedTabDetail
    const disabledPlugins = [...disabled]
    active.forEach((name: string) => {
      generatedPluginDetails.push({
        ...(store.plugins?.[name] as IPluginCardDetail),
        id: name,
        isActive: true,
        isDisabled: checkIsDisabledPlugin(disabledPlugins, name),
        isInactive: false
      })
    })

    inactive.forEach((name: string) => {
      generatedPluginDetails.push({
        ...(store.plugins?.[name] as IPluginCardDetail),
        id: name,
        isActive: false,
        isDisabled: checkIsDisabledPlugin(disabledPlugins, name),
        isInactive: true
      })
    })

    disabledPlugins.forEach((name: string) => {
      generatedPluginDetails.push({
        ...(store.plugins?.[name] as IPluginCardDetail),
        id: name,
        isActive: false,
        isDisabled: true,
        isInactive: false
      })
    })
  }

  // add currently selected plugin tab details
  store.setGeneratedDetails(generatedPluginDetails)

  // set isDisableAllPlugins toggle state
  store.setIsDisableAllPluginState(
    tabDetails.value.every(
      (data) => data.active.length + data.inactive.length <= data.disabled.length
    )
  )
  return generatedPluginDetails
}
