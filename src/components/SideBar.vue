<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { type ITabDetail } from '@/types/PluginResponseDetail'
import ToggleButton from '@/components/ToggleButton.vue'
import { usePluginStore } from '@/stores/plugin'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

defineProps<{ tabDetails: ITabDetail[]; selectedTab: string }>()

const store = usePluginStore()
const isOpen = ref(false)

//  load icons dynamically based on icon name
const modules = import.meta.glob('../assets/icons/*.svg', {
  as: 'raw',
  eager: true
})
const getIcon = (iconName: string) => {
  const { value } = computed(() => {
    return (
      modules['../assets/icons/' + iconName + '.svg'] ?? modules['../assets/icons/icon-people.svg']
    )
  })
  return value
}

// click outside to close the sidebar for smaller screens
const handleClickOutside = (event: any) => {
  const modalContainer = document.querySelector('#default_sidebar')

  if (modalContainer && !modalContainer.contains(event.target.parentNode)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// update server with plugins disabled or enabled state
const onToggleDisableOrEnableAllPlugins = () => {
  store.postPluginsPageDetail(true)
}
</script>

<template>
  <button
    id="default_sidebar"
    @click="() => (isOpen = !isOpen)"
    type="button"
    class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
  >
    <span class="sr-only">Open sidebar</span>
    <svg
      class="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        fill-rule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      ></path>
    </svg>
  </button>

  <aside
    class="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
    :class="{ 'transform-none': isOpen }"
    aria-label="Sidebar"
  >
    <div class="h-full py-4 overflow-y-auto bg-gray-100">
      <router-link
        :to="{ name: 'plugins', params: { id: tabDetails.length ? tabDetails[0].title : '/' } }"
      >
        <h1 class="text-center text-2xl py-5">
          <span>Data</span><span class="font-black">Guard</span>
        </h1>
      </router-link>

      <ul class="space-y-2 font-medium">
        <li v-for="item in tabDetails" class="transition-opacity duration-300" :key="item?.title">
          <router-link
            :to="{ name: 'plugins', params: { id: item.title } }"
            :class="{ 'bg-white border-l-4 border-red-700': selectedTab === item.title }"
            class="flex items-center p-5 text-gray-900 hover:bg-white group hover:border-l-4 hover:border-red-700 hover:transition hover:duration-150 hover:ease-in-out"
          >
            <svg
              :class="{ 'text-gray-900 ': selectedTab === item.title }"
              class="w-8 h-8 text-gray-500 transition duration-75 group-hover:text-gray-900"
              v-html="getIcon(item.icon)"
            ></svg>
            <span class="ml-3 hover:text-black">{{ item.title }}</span>
          </router-link>
        </li>
        <!-- SkeletonLoader -->
        <li class="transition-opacity duration-300" v-if="store.isLoading">
          <SkeletonLoader class="h-10 ml-5 mr-5 mb-6 mt-4" />
          <SkeletonLoader class="h-10 ml-5 mr-5 mb-6" />
          <SkeletonLoader class="h-10 ml-5 mr-5" />
        </li>
      </ul>
      <div class="absolute bottom-0 p-3 w-full">
        <SkeletonLoader class="h-10 ml-5 mr-5 mb-6 mt-4" v-if="store.isLoading" />
        <div class="inline-flex" v-if="!store.isLoading">
          <p class="pr-6">All plugins {{ store.isDisableAllPlugins ? 'Enabled' : 'Disabled' }}</p>
          <ToggleButton
            v-model:checked="store.isDisableAllPlugins"
            @onToggleButton="onToggleDisableOrEnableAllPlugins"
          />
        </div>
      </div>
    </div>
  </aside>
  <div class="bg-gray-900 bg-opacity-50 fixed inset-0 z-30" v-if="isOpen"></div>
</template>

<style scoped></style>
