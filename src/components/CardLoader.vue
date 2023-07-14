<template>
  <div class="flex items-center justify-center min-h-24 rounded min-h-" v-if="isLoading">
    <div
      class="border-r border-b border-l border-gray-300 border-t bg-white rounded-b rounded-r rounded-t p-5 flex flex-col justify-between leading-normal h-60 w-full"
    >
      <div class="">
        <div class="flex justify-between mb-3">
          <div class="pr-0 flex gap-8 flex-col">
            <SkeletonLoader class="max-[492px]:w-20 w-28 h-3 mt-2" />
            <SkeletonLoader class="max-[492px]:w-40 w-80 h-2 mt-6" />
            <SkeletonLoader class="max-[492px]:w-40 w-80 h-2 mt-1" />
            <SkeletonLoader class="max-[492px]:w-40 w-80 h-2 mt-1" />
          </div>
          <SkeletonLoader class="max-[492px]:w-16 w-20 h-8" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/SkeletonLoader.vue'
defineProps<{ isLoading: boolean }>()
</script>
