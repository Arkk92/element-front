<template>
  <div class="user-layout">
    User list:
    <div class="row" v-for="user in users" :key="user">
      {{  user.name  }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { UserModel } from '@/game/models/user';

export default defineComponent({
  name: 'UserLayout',
  components: {
  },
  props: {
    userList: Array as PropType<Array<UserModel>>,
  },
  data() {
    return {
      username: "Username",
      data_ready: false,
      users: new Array<UserModel>(),
    }
  },
  mounted() {
    if ( this.userList != null ){
      this.users = this.userList;
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
