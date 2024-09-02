<!-- ButtonFetchReport.vue -->
<template>
  <button class="btn-fetch-report" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ButtonFetchReport',
};
</script>

<style scoped lang="scss">
@import '@/styles/_variables.scss';
@import '@/styles/_typography.scss';
@import '@/styles/_buttons.scss';

.btn-fetch-report {
  @include button-base($primary-color, $light-color);
}
</style>
