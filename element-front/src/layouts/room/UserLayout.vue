<template>
  <div class="user-layout">
    User list:

    <div class="list-group">
      <a class="list-group-item list-group-item-action disabled" v-for="user in users" :key="user"
        :class="(user.uuid === currentUserId) ? 'active' : ''"
        :aria-current="(user.uuid === currentUserId) ? 'true' : 'false'">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ user.name }}</h5>
          <i v-if="user.uuid === turnUserId" class="bi-person-circle" role="img" aria-label="currentUser"></i>
        </div>
        <p class="mb-1" v-if="user.uuid === turnUserId">{{ getTurnState() }}</p>
        <p class="mb-1" v-else>Waiting...</p>
        <small>{{ user.uuid }}</small>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { UserModel } from '@/game/models/user';
import { TurnModel, TurnStates } from '@/game/models/turn';

export default defineComponent({
  name: 'UserLayout',
  components: {
  },
  props: {
    userList: Array as PropType<Array<UserModel>>,
    currentUserId: String,
    turnUserId: String,
    turn: TurnModel,
  },
  data() {
    return {
      username: "Username",
      data_ready: false,
      users: new Array<UserModel>(),
    }
  },
  mounted() {
    if (this.userList != null) {
      this.users = this.userList;
    }
  },
  methods: {        
    getTurnState(): string {
      switch (this.turn?.state) {
        case TurnStates.DrawingElements:
          return 'Drawing elements'
        case TurnStates.MovesAvailables:
          return 'Playing'
        case TurnStates.EndTurn:
          return 'End turn'
      }
      return "";
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
