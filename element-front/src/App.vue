<template>
  <UpperNavBarVue/>
  <RoomViewVue/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RoomViewVue from './views/RoomView.vue';
import UpperNavBarVue from './layouts/UpperNavBar.vue';

@Options({
  components: {
    UpperNavBarVue,
    RoomViewVue,
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
