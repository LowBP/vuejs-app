export type ITabDetail = {
  title: string
  icon: string
  active: string[]
  disabled: string[]
  inactive: string[]
}

export type ITabData = {
  [key: string]: ITabDetail
}

export type IPluginDetail = {
  title: string
  description: string
}
export type IPlugins = {
  [key: string]: IPluginDetail
}

export type IPluginResponseDetail = {
  tabs?: string[]
  tabdata: ITabData
  plugins?: IPlugins
}

export type ITabId = {
  tabId: string
}

export type IPluginCardDetail = IPluginDetail & {
  id: string
  isActive: boolean
  isDisabled: boolean
  isInactive: boolean
}
