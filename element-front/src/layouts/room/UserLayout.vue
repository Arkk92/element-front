<template>
  <div class="user-layout">

    <div class="list-group" v-if="data_ready">
      <a class="list-group-item list-group-item-action disabled user-box border-1" v-for="user in userList" :key="user"
        :class="getUserBoxClassByUser(user)" :aria-current="(user.uuid === currentUserId) ? 'true' : 'false'">
        <div class="overlay-info">

          <h5 class="col">
            {{ user.name }} <span v-if="isTarget(user.uuid)">💀</span>
          </h5>
          <p class="mb-1" v-if="user.uuid === turnUserId">{{ getTurnState() }}</p>
          <p class="mb-1" v-else>Waiting...</p>
          <p class="mb-1">Player number: {{ getPlayerNumberByUserId(user.uuid) }}</p>
        </div>
        <div class="wizard-wrap">
          <img class="wizard" :src="getImage(getPlayerNumberByUserId(user.uuid))">
        </div>
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
import { useCookies } from "vue3-cookies";

import rockWizardImageUrl from '@/assets/wizards/RockWizard.png'
import fireWizardImageUrl from '@/assets/wizards/FireWizard.png'
import waterWizardImageUrl from '@/assets/wizards/WaterWizard.png'
import windWizardImageUrl from '@/assets/wizards/WindWizard.png'

export default defineComponent({
  name: 'UserLayout',
  components: {
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  props: {
    userList: Array as PropType<Array<UserModel>>,
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
      currentUserId: '',
    }
  },
  mounted() {
    if (this.userList != null) {
      this.currentUserId = this.cookies.get('userId');
      this.data_ready = true;
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
          return rockWizardImageUrl
        case 1:
          return fireWizardImageUrl
        case 2:
          return waterWizardImageUrl
        case 3:
          return windWizardImageUrl
      }
    },
    isTarget(userId: string): boolean {
      return this.playerList!.filter(player => player.player_number == this.getPlayerNumberByUserId(this.currentUserId!))[0].target == this.getPlayerNumberByUserId(userId);


    },
    getUserBoxClassByUser(user: UserModel): string {
      let classes = "";
      if (user.uuid === this.currentUserId) {
        classes += 'active active-shinning';
      } else {
        classes += 'no-active'
      }
      if (user.uuid === this.turnUserId) {
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
