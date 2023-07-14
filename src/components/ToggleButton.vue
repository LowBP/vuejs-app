<template>
  <div class="flex flex-col">
    <label
      class="relative flex items-center mr-5 mb-2"
      :class="{ 'cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
    >
      <input
        type="checkbox"
        value=""
        class="sr-only peer"
        :checked="checked"
        :disabled="disabled"
        @input="toggleButton"
      />
      <div
        :class="{
          'bg-green-300': checked && disabled,
          'peer-focus:ring-green-300 peer-checked:bg-green-600': checked && !disabled,
          'peer-focus:ring-red-300 ring-red-800  bg-red-600': !checked && !disabled,
          'bg-red-300': !checked && disabled
        }"
        class="w-11 h-6 rounded-full peer peer-focus:ring-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
      ></div>
    </label>
    <div
      class="text-sm font-medium text-gray-900"
      v-if="showHelperText"
      :class="{
        'text-green-300': checked && disabled,
        'text-red-300': !checked && disabled,
        'text-green-600': checked && !disabled,
        'text-red-600': !checked && !disabled
      }"
    >
      {{ checked ? 'Allowed' : 'Blocked' }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
  checked?: boolean
  showHelperText?: boolean
  onToggleButton?: (isChecked: boolean) => void
}>()

const emit = defineEmits<{
  (e: 'update:checked', value: boolean): void
  (e: 'onToggleButton', value: boolean): void
}>()

const toggleButton = () => {
  emit('update:checked', !props.checked)
  emit('onToggleButton', !props.checked)
}
</script>

<style scoped></style>
