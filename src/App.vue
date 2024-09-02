<template>
  <div id="app">
    <div class="main">
      <router-view/>
    </div>
    <BottomMenu />
  </div>
</template>

<script>
import BottomMenu from "./components/BottomMenu.vue";
import router from "./router/index";

export default {
  components: {
    BottomMenu, router
  }
}
</script>

<style lang="scss">
@import './styles/main.scss';
</style>
