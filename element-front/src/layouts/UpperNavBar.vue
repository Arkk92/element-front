<template>
  <div class="upper-nav-bar">
    <div class="row">
      <div class="col">
        Welcome, {{username}}
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
import { Emitter } from '@/main';

export default defineComponent({
  name: 'UpperNavBarComponent',
  components: {
    QueueVue
  },
  data() {
    return {
      username: "Guest"
    }
  },
  mounted() {
    Emitter.on('usernameChange', (username)=> {
      this.username = username as string
    })
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
