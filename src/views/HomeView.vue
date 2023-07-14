<template>
  <div>
    <SideBar :tabDetails="store.tabDetails" :selectedTab="selectedTab?.valueOf()" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import SideBar from '../components/SideBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, watchEffect } from 'vue'
import { usePluginStore } from '@/stores/plugin'

const store = usePluginStore()

const route = useRoute()
const router = useRouter()
const selectedTab = computed(() => {
  return route.params.id as string
})

onMounted(() => {
  store.getPluginPageDetail()
})

watchEffect(() => {
  // redirected to first tab when the route path is empty
  if (!selectedTab.value) {
    const { title: routeId } = store.tabDetails?.[0] || {}
    if (routeId) {
      store.setActiveTabName(routeId)
      router.replace('/plugins/' + routeId)
    }
    return
  }

  // set activeTabName to display the page title
  if (selectedTab.value) {
    store.setActiveTabName(selectedTab.value)
  }
})
</script>
