<template>
  <div class="queue">
    <!-- Button trigger modal -->
    <div v-if="isRoomStateIdle">
      <NavButton v-on:click="isMenuOpen = true" :text="gameType" :disabled="isRankedMatch" />
    </div>
    <div class="find-game-wrapper" v-else>
      <NavButton class="queue-status-button" :text="queueStatus" :disabled="true" />
    </div>
  </div>
  <PlayMenuModal :isOpen="isMenuOpen" @close="isMenuOpen = false" @start-game="startLookingForGame"
    @username="handleUsernameChange" :is-competitive="isRankedMatch" />
  <JoinGameModal :isOpen="isJoinGameOpen" :game-found="isRoomStateGameFound" @close="isJoinGameOpen = false"
    @join-game="joinGame" @cancel-search="cancelQueue" />
</template>

<script lang="ts">
import JoinGameModal from '@/components/JoinGameModal.vue';
import NavButton from '@/components/NavButton.vue';
import PlayMenuModal from '@/components/PlayMenuModal.vue';
import { Emitter, SocketInstance } from '@/main';
import { Queue } from '@/sockets/socketUtils';
import { RoomState, useRoomStore } from '@/stores/room';
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";

type QueueTypes = 'none' | 'queue2' | 'queue3' | 'queue4'

export default defineComponent({
  name: 'QueueComponent',
  components: {
    NavButton,
    PlayMenuModal,
    JoinGameModal,
  },
  props: {
    gameType: String,
  },
  setup() {
    const { cookies } = useCookies();

    return {
      cookies
    };
  },
  data() {
    return {
      queueStatus: "Idle" as RoomState,
      queueType: "none" as QueueTypes,
      roomId: "",
      drawType: 'random',
      username: "Guest",
      usernameError: '',
      isMenuOpen: false,
      isJoinGameOpen: false,
    }
  },
  mounted() {

    Emitter.on('GameUpdate', () => {
      this.isJoinGameOpen = false;
    })

    Emitter.on('ReJoiningGame', () => {
      this.queueStatus = 'Re-Joining'
    });

    Emitter.on('GameFound', () => {
      if (this.isRankedMatch) {
        return;
      }
      this.queueStatus = 'GameFound'
    });
  },
  computed: {
    isQuickMatch(): boolean {
      return this.gameType === 'Quick Match';
    },
    isRankedMatch(): boolean {
      return this.gameType === 'Ranked Match';
    },
    isRoomStateIdle(): boolean {
      return this.queueStatus === 'Idle';
    },
    isRoomStateGameFound(): boolean {
      return this.queueStatus === 'GameFound';
    }
  },
  methods: {
    joinGame(): void {
      const roomStore = useRoomStore();
      roomStore.updateRoomState('Joining');

      this.isJoinGameOpen = false;
      this.queueStatus = 'Joining';
    },

    cancelQueue(): void {
      const roomStore = useRoomStore();
      this.queueStatus = 'Idle';
      this.isJoinGameOpen = false;
      if (roomStore.roomSize) {
        roomStore.updateRoomState('Idle');
      }
    },

    handleUsernameChange(username: string) {
      this.username = username;
    },

    isOfQueueTypes(keyInput: string): keyInput is QueueTypes {
      return ['queue2', 'queue3', 'queue4'].includes(keyInput);
    },

    startLookingForGame(numPlayers: number) {
      const roomStore = useRoomStore();
      const queueType = `queue${numPlayers}`

      if (!this.isOfQueueTypes(queueType)) {
        roomStore.updateRoomState('Idle')
        this.queueStatus = 'Idle';
        return;
      }

      if (this.username === '') {
        this.username = 'Guest-' + SocketInstance!.id!.slice(0, 4);
      }
      this.isJoinGameOpen = true;
      roomStore.username = this.username;
      roomStore.roomSize = queueType as Queue;
      roomStore.updateRoomState('Searching');

      this.isMenuOpen = false;
    }


  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.queue {
  position: relative;
  width: 100%;
  height: 100%;
}

.find-game-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.queue-status-button {
  position: absolute;
  width: 100%;
  left: 0;
}

.cancel-queue {
  position: absolute;
  width: 30%;
  left: 72%;
}
</style>
