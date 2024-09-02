<template>
  <button class="btn-fetch-stocks" @click="$emit('click')">
    <slot></slot> <!-- Используем слот, чтобы текст кнопки был настраиваемым -->
  </button>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.btn-fetch-stocks {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
}
</style>
