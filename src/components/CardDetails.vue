<template>
  <div
    class="flex items-center justify-center min-h-24 rounded"
    v-for="item of pluginCards"
    :key="item.title"
  >
    <div
      class="border-r border-b border-l border-gray-300 border-t bg-white rounded-b rounded-r rounded-t p-5 flex flex-col justify-between leading-normal lg:sm:h-60 w-full"
    >
      <div class="">
        <div class="flex justify-between mb-3">
          <div class="pr-0 flex gap-8 flex-col">
            <h1
              :class="{ 'text-gray-300': item.isDisabled, 'text-gray-600': !item.isDisabled }"
              class="text-2xl font-medium"
            >
              {{ item.title }}
            </h1>
            <p
              class="text-base break-words lg:max-h-32 lg:overflow-y-auto lg:bg-scroll lg:overflow-visible font-light text-black pr-4"
              :class="{ 'text-gray-300': item.isDisabled }"
            >
              {{ item.description }}
            </p>
          </div>

          <ToggleButton
            v-model:checked="item.isActive"
            @onToggleButton="(checkedValue) => onToggleButton(checkedValue, item.id)"
            :disabled="item.isDisabled"
            :showHelperText="true"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- SkeletonLoader -->
  <CardLoader :isLoading="store.isLoading" />
  <CardLoader :isLoading="store.isLoading" />
</template>

<script setup lang="ts">
import ToggleButton from '@/components/ToggleButton.vue'
import { usePluginStore } from '@/stores/plugin'
import CardLoader from '@/components/CardLoader.vue'

defineProps<{ pluginCards: any[] }>()

const store = usePluginStore()

const onToggleButton = (checkedValue: boolean, pluginId: string) => {
  store.setActiveInactiveState(checkedValue, pluginId)
  store.postPluginsPageDetail()
}
</script>
