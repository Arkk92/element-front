<template>
  <div class="upper-nav-bar">
    <div class="row">
      <div class="col">
        Welcome, {{username}}
      </div>
      <div class="col">
        <QueueVue/>
      </div>
      <div class="col">
        <ForfeitBtn
        :show="forfeitBtnShow"
        />
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QueueVue from '@/components/Queue.vue';
import { Emitter } from '@/main';
import ForfeitBtn from '@/components/ForfeitBtn.vue';

export default defineComponent({
  name: 'UpperNavBarComponent',
  components: {
    QueueVue,
    ForfeitBtn
},
  data() {
    return {
      username: "Guest",
      forfeitBtnShow: false,
    }
  },
  mounted() {
    Emitter.on('usernameChange', (username)=> {
      this.username = username as string;
      this.forfeitBtnShow = true;
    })
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
