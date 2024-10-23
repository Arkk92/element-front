<template>
  <div class="room-container">
    <Background />
    <div v-if="isGameStarted" class="room-layout">

      <div class="container-fluid full-height-container">
        <div class="row custom-row">
          <div class="col side-col overlay-column">
            <UserLayout class="user-layout-column" />
            <Logger class="logger-layout-column" />
          </div>
          <div class="col center-col overlay-column d-flex justify-content-center align-items-center">
            <GameLayout :game="roomStore.model.game" />
          </div>
          <div class="col side-col overlay-column">
            <div class="chat-layout-wrapper">
              <ChatLayout :room-id="roomStore.model.uuid" />
            </div>
            <div class="player-action-layout">
              <PlayerActionsLayout />
            </div>
          </div>
          <WinnerLayout v-if="isGameOver" @on-close="resetRoomLayout" />
        </div>
      </div>

    </div>
    <div class="room-layout" v-else>
      <MainMenu />
    </div>
  </div>
</template>

<script lang="ts">
import Background from '@/presentation/components/Background.vue';
import Logger from '@/presentation/components/Logger.vue';
import MainMenu from '@/presentation/components/MainMenu/MainMenu.vue';
import { useQueueStore } from '@/presentation/stores/queue';
import { useRoomStore } from '@/presentation/stores/room';
import { defineComponent } from 'vue';
import UserLayout from './UserLayout.vue';
import WinnerLayout from './WinnerLayout.vue';
import ChatLayout from './chatLayout.vue';
import GameLayout from './gameLayout.vue';
import PlayerActionsLayout from './playerActionsLayout.vue';
import { useAuthStore } from '@/presentation/stores/auth';

export default defineComponent({
  name: 'RoomLayout',
  components: {
    UserLayout,
    GameLayout,
    ChatLayout,
    WinnerLayout,
    PlayerActionsLayout,
    Logger,
    Background,
    MainMenu
  },
  setup() {
    const queueStore = useQueueStore();
    const roomStore = useRoomStore();
    const authStore = useAuthStore();

    return { queueStore, roomStore, authStore };
  },
  mounted() {
    this.roomStore.listenForRoomUpdates();
    if(this.authStore.roomId){
      this.queueStore.reJoinGame()
    }
  },
  computed: {
    isGameStarted() {
      return this.queueStore.queueState === 'Playing';
    },
    isGameOver() {
      return this.roomStore.winner !== null;
    }
  },
  methods: {
    resetRoomLayout() {
      this.queueStore.reset();
      this.roomStore.reset();
    }

  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.room-layout {
  position: absolute;
  width: 100%;
  top: 6%;
  height: 88%;
  min-height: 88%;
}

.overlay-column {
  z-index: 1000;
}

.custom-row {
  height: 100%;
}

.center-col {
  height: 100%;
}

.side-col {
  flex: 0 0 15%;
  /* Each column takes 15% of the row's width */
  max-width: 15%;
  height: 100%
}

.full-height-container {
  position: absolute;
  height: 100%;
}

.chat-layout-wrapper {
  position: relative;
  height: 60%;
}

.player-action-layout {
  position: relative;
  height: 40%;
}

.user-layout-column {
  height: 60%;
  width: 100%;
}

.logger-layout-column {
  height: 40%;
  width: 100%;
}
</style>
