<template>
  <UpperNavBarVue/>
  <RoomViewVue/>
  <FooterNavBarVue/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RoomViewVue from './views/RoomView.vue';
import UpperNavBarVue from './layouts/UpperNavBar.vue';
import FooterNavBarVue from './layouts/FooterNavBar.vue';

@Options({
  components: {
    UpperNavBarVue,
    FooterNavBarVue,
    RoomViewVue,
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
