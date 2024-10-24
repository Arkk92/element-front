<template>
  <div class="queue">
    <!-- Button trigger modal -->
    <div v-if="!isQueueIdle && applyToThisQueue" class="find-game-wrapper">
      <NavButton class="queue-status-button" :text="queueStore.queueState" :disabled="true" />
    </div>
    <div v-else>
      <NavButton v-on:click="isMenuOpen = true" :text="formattedGameType" :disabled="isRankedMatch || isCustomMatch" />
    </div>
  </div>
  <PlayMenuModal :isOpen="isMenuOpen" @close="isMenuOpen = false" @start-game="startLookingForGame"
    @username="handleUsernameChange" :is-competitive="isRankedMatch" />
  <JoinGameModal :isOpen="isJoinGameOpen" :game-found="isGameFoundState" @close="isJoinGameOpen = false"
    @join-game="joinGame" @cancel-search="cancelQueue" />
</template>

<script lang="ts">
import { Queue } from '@/infra/sockets/socketUtils';
import JoinGameModal from '@/presentation/components/JoinGameModal.vue';
import NavButton from '@/presentation/components/NavButton.vue';
import PlayMenuModal from '@/presentation/components/PlayMenuModal.vue';
import { useAuthStore } from '@/presentation/stores/auth';
import { useQueueStore } from '@/presentation/stores/queue';
import { defineComponent } from 'vue';

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
    const queueStore = useQueueStore();
    const authStore = useAuthStore()
    return {
      queueStore, authStore
    };
  },
  data() {
    return {
      username: "Guest",
      isMenuOpen: false,
      isJoinGameOpen: false,
    }
  },
  mounted() {
    this.queueStore.listenForGameFound();
    this.authStore.listenForAuthUpdates();
  },
  computed: {
    isQuickMatch(): boolean {
      return this.gameType === 'Quick';
    },
    isRankedMatch(): boolean {
      return this.gameType === 'Ranked';
    },
    isCustomMatch(): boolean {
      return this.gameType === 'Custom';
    },
    isQueueIdle(): boolean {
      return this.queueStore.queueState === 'Idle';
    },
    isGameFoundState(): boolean {
      return this.queueStore.queueState === 'Game Found';
    },
    formattedGameType(){
      return this.gameType + ' Match';
    },
    applyToThisQueue(){
      return this.queueStore.gameType === this.gameType
    }
  },
  methods: {
    joinGame(): void {
      this.queueStore.joinGame(this.username);
      this.isJoinGameOpen = false;
    },

    cancelQueue(): void {
      this.queueStore.cancelQueue()
      this.isJoinGameOpen = false;
    },

    handleUsernameChange(username: string) {
      this.username = username;
    },

    isOfQueueTypes(keyInput: string): keyInput is Queue {
      return ['queue2', 'queue3', 'queue4'].includes(keyInput);
    },

    startLookingForGame(numPlayers: number) {
      const queueType = `queue${numPlayers}`

      if (!this.isOfQueueTypes(queueType)) {
        return;
      }
      this.isJoinGameOpen = true;

      this.queueStore.searchGame(queueType)

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
