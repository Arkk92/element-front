<template>
  <div class="upper-nav-bar">
    <div class="row">
      <div class="col">
        {{username}}
      </div>
      <div class="col">
        <QueueVue/>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QueueVue from '@/components/Queue.vue';

export default defineComponent({
  name: 'UpperNavBarComponent',
  components: {
    QueueVue
  },
  data() {
    return {
      username: "Username"
    }
  },
  mounted() {

  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
