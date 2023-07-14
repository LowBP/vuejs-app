<template>
  <div class="p-4 sm:ml-64 max-[492px]:p-2">
    <div class="">
      <div
        class="max-[492px]:pt-2 max-[492px]:pb-2 p-4 pt-6 pb-6 font-bold text-xl sticky top-0 w-full"
      >
        {{ store.activeTabName }} Plugins
      </div>
    </div>

    <div class="p-4 max-[492px]:p-2">
      <div class="grid gap-4 mb-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <CardDetails
          :selectedTab="store.activeTabName"
          :pluginCards="pluginCards.value"
          :activeTabId="activeTabId.valueOf()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardDetails from '@/components/CardDetails.vue'
import { generatePluginCardDetails } from '@/stores/-private'
import { usePluginStore } from '@/stores/plugin'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// store references
const store = usePluginStore()
const { activeTabId, pluginCardDetails } = storeToRefs(store)

const selectedTabDetail = computed(() => {
  return store.tabDetails.find((tab) => tab.title === store.activeTabName)
})

const pluginCards = computed(() => {
  if (
    selectedTabDetail.value &&
    (selectedTabDetail.value.tabId !== activeTabId.value || store.isGlobalDisableUpdated)
  ) {
    store.setActiveTabKey(selectedTabDetail.value.tabId as string)
    // generate card details based on selected tab details
    generatePluginCardDetails(selectedTabDetail.value)
    store.$patch((state) => {
      state.isGlobalDisableUpdated = false
    })
  }
  return pluginCardDetails
})
</script>

<style></style>
