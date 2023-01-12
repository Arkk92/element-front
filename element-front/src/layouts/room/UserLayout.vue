<template>
  <div class="user-layout">
    User list:
    <div class="list-group">
      <a class="list-group-item list-group-item-action disabled" v-for="user in users" :key="user"
        :class="(user.uuid === currentUserId) ? 'active' : ''"
        :aria-current="(user.uuid === currentUserId) ? 'true' : 'false'">
        <div class="row justify-content-between">
          <div class="col">
            <img class="wizardSmall" :src="getImage(getPlayerNumberByUserId(user.uuid))">
          </div>
          
          <h5 class="col">{{ user.name }}</h5>
        </div>
        <p class="mb-1" v-if="user.uuid === turnUserId">{{ getTurnState() }}</p>
        <p class="mb-1" v-else>Waiting...</p>
        <i v-if="isTarget(user.uuid)" class="bi-bullseye target" role="img" aria-label="target"></i>
        <small> Player number: {{ getPlayerNumberByUserId(user.uuid) }}</small>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { UserModel } from '@/game/models/user';
import { TurnModel, TurnStates } from '@/game/models/turn';
import { PlayerModel } from '@/game/models/player';
import { UserToPlayerMap } from '@/game/models/room';

export default defineComponent({
  name: 'UserLayout',
  components: {
  },
  props: {
    userList: Array as PropType<Array<UserModel>>,
    currentUserId: String,
    playerList: Array as PropType<Array<PlayerModel>>,
    userToPlayerMap: Array as PropType<Array<UserToPlayerMap>>,
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
    },
    getPlayerNumberByUserId(userId: string): number {
      const playerId: string = this.userToPlayerMap!.filter(map => map.user_uuid === userId)[0].player_uuid;
      return this.playerList!.filter(player => player.uuid === playerId)[0].player_number;
      
    },
    getImage(playerNumber: number): any {
      switch (playerNumber) {
        case 0:
          return require('@/assets/wizards/Wizard_1.png');
        case 1:
          return require('@/assets/wizards/Wizard_2.png');
        case 2:
          return require('@/assets/wizards/Wizard_3.png');
        case 3:
          return require('@/assets/wizards/Wizard_4.png');
      }
    },
    isTarget(userId: string): boolean {
      return this.playerList!.filter(player => player.player_number == this.getPlayerNumberByUserId(this.currentUserId!))[0].target == this.getPlayerNumberByUserId(userId);
      
      
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wizardSmall {
  height: 32px;
  
}
.target {
  color: red;
}
</style>
