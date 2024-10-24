<template>
  <div class="user-layout">

    <div class="list-group">
      <a class="list-group-item list-group-item-action disabled user-box border-1" v-for="user in userList" :key="user as any"
        :class="getUserBoxClassByUserId(user.uuid)" :aria-current="(user.uuid === currentUserId) ? 'true' : 'false'">
        <div class="overlay-info">

          <h5 class="col">
            {{ user.name }} <span v-if="isTarget(getPlayerIdByUserId(user.uuid))">💀</span>
          </h5>
          <p class="mb-1" v-if="isUserTurn(user.uuid)">{{ getTurnState() }}</p>
          <p class="mb-1" v-else>Waiting...</p>
          <p class="mb-1">Player number: {{ getPlayerNumber(getPlayerIdByUserId(user.uuid)) }}</p>
        </div>
        <div class="wizard-wrap">
          <img class="wizard" :src="getImage(getPlayerNumber(getPlayerIdByUserId(user.uuid)))">
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { PlayerModel } from '@/domain/game/models/player';
import { UserToPlayerMap } from '@/domain/game/models/room';
import { TurnStates } from '@/domain/game/models/turn';
import { UserModel } from '@/domain/game/models/user';
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";

import { useAuthStore } from '@/presentation/stores/auth';
import { useRoomStore } from '@/presentation/stores/room';
import fireWizardImageUrl from '/assets/FireWizard.png';
import rockWizardImageUrl from '/assets/RockWizard.png';
import waterWizardImageUrl from '/assets/WaterWizard.png';
import windWizardImageUrl from '/assets/WindWizard.png';

export default defineComponent({
  name: 'UserLayout',
  components: {
  },
  setup() {
    const { cookies } = useCookies();
    const roomStore = useRoomStore();
    const authStore = useAuthStore();
    return { cookies, roomStore, authStore };
  },
  computed: {
    currentUserId(): string {
      return this.authStore.userId;
    },
    userList(): Array<UserModel> {
      return this.roomStore.model.user_list
    },
    playerList(): Array<PlayerModel> {
      return this.roomStore.model.game.player_list;
    },
    userToPlayerMap(): Array<UserToPlayerMap> {
      return this.roomStore.model.user_to_player_map;
    },
    turnPlayerId(): string {
      return this.roomStore.turnPlayerId;
    },
    turnState(): TurnStates {
      return this.roomStore.model.game.turn.state;
    },
    playerId(): string {
      return this.authStore.playerId;
    },
    

  },
  methods: {
    getPlayerIdByUserId(userId: string): string {
      return this.userToPlayerMap.filter(user => user.user_uuid === userId)[0].player_uuid;
    },
    getPlayerNumber(playerId: string): number {
      return this.playerList.filter(player => player.uuid === playerId)[0].player_number;
    },
    getTurnState(): string {
      switch (this.turnState) {
        case TurnStates.DrawingElements:
          return 'Drawing elements'
        case TurnStates.MovesAvailables:
          return 'Playing'
        case TurnStates.EndTurn:
          return 'End turn'
      }
    },
    getImage(playerNumber: number): any {
      switch (playerNumber) {
        case 0:
          return rockWizardImageUrl
        case 1:
          return fireWizardImageUrl
        case 2:
          return waterWizardImageUrl
        case 3:
          return windWizardImageUrl
      }
    },
    isUserTurn(userId: string): boolean {
      const userModels = this.roomStore.model.user_to_player_map.filter(user => user.player_uuid === this.playerId);
      if(userModels.length < 1) return false;
      return this.roomStore.model.user_to_player_map.filter(user => user.player_uuid === this.playerId)[0].user_uuid === userId;
    },
    isTarget(playerId: string): boolean {
      return this.playerList.filter(
        player => player.player_number == this.getPlayerNumber(this.playerId)
      )[0].target == this.getPlayerNumber(playerId);
    },
    getUserBoxClassByUserId(userId: string): string {
      let classes = "";
      if (userId === this.currentUserId) {
        classes += 'active active-shinning';
      } else {
        classes += 'no-active'
      }

      if (this.getPlayerIdByUserId(userId) === this.turnPlayerId) {
        classes += ' active-user-box';
      }
      return classes;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-layout {
  display: block;
  padding-top: 20px;
  padding-bottom: 5px;
  height: 100%;
}

.user-box {
  padding-top: 10px;
  overflow: hidden;
  max-height: 50%;
  min-height: 25%;
}

.list-group {
  max-height: 100%;
}

.active-user-box {
  width: 100% !important;
}

.overlay-info {
  position: relative;
  color: white;
  top: 0;
  left: 0;
  z-index: 1001;
}

.wizard-wrap {
  position: absolute;
  overflow: hidden;
  margin: 0;
  right: 0;
  top: 0;
  z-index: 1000;
  width: 70%;
  height: 100%;
}

.wizard {
  position: absolute;
  right: 0;
  width: 150px;
  height: 150px;
}

.wizardSmall {
  height: 32px;

}

.target {
  color: red;
}

a {
  border-color: rgb(80, 80, 80) !important;
}

.no-active {
  background-color: #2a2d32 !important;
  width: 80%;
}

.active {
  background-color: #3d4249;
  border-color: rgba(114, 114, 37, 1) !important;
  width: 80%;
}

.active-shinning {
  animation: fadeIn 0.75s;
  animation-iteration-count: infinite;
}

@keyframes fadeIn {
  0% {
    background-color: #2a2d32;
  }

  50% {
    background-color: #3d4249;
  }

  100% {
    background-color: #2a2d32;
  }
}

@media screen and (max-width: 1400px) {
  .wizard-wrap {
    display: none;
  }

  .wizard {
    display: none;
  }

  .mb-1 {
    display: none;
  }

  p {
    word-break: break-all;
    white-space: normal;
    margin: 0;
  }
}
</style>
