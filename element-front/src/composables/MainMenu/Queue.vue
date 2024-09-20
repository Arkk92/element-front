<template>
  <div class="queue">
    <!-- Button trigger modal -->
    <div v-if="(queueStatus == 'Play')">
      <NavButton v-on:click="isMenuOpen = true" :text="queueStatus" />
    </div>
    <div class="find-game-wrapper" v-else>
      <NavButton class="queue-status-button" :text="queueStatus" :disabled="true" />
    </div>
  </div>
  <PlayMenuModal :isOpen="isMenuOpen" @close="isMenuOpen = false" @start-game="startLookingForGame"
    @select="handleSelect" />
  <JoinGameModal :isOpen="isJoinGameOpen" :game-found="queueStatus == 'GameFound'" @close="isJoinGameOpen = false"
    @join-game="joinGame" @cancel-search="cancelQueue" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Emitter, SocketInstance } from '@/main'
import { GameFound, Queue, UserAuthData } from '@/sockets/socketUtils';
import { useCookies } from "vue3-cookies";
import NavButton from '@/components/NavButton.vue';
import PlayMenuModal from '@/components/PlayMenuModal.vue';
import JoinGameModal from '@/components/JoinGameModal.vue';

type QueueStatus = "Play" | "Searching game..." | "GameFound" | "Joining";
type QueueTypes = 'none' | 'queue2' | 'queue3' | 'queue4'

export default defineComponent({
  name: 'QueueComponent',
  components: {
    NavButton,
    PlayMenuModal,
    JoinGameModal,
  },
  setup() {
    const { cookies } = useCookies();

    return {
      cookies
    };
  },
  data() {
    return {
      queueStatus: "Play" as QueueStatus,
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

    if (this.cookies.get("roomId") != null) {
      this.roomId = this.cookies.get("roomId")
    }

    SocketInstance.on("gameFound", (data: GameFound) => {
      this.queueStatus = 'GameFound';
      this.roomId = data.roomId;
    })

    SocketInstance.on('userAuthData', (data: UserAuthData) => {
      this.cookies.set("roomId", data.roomUuid, 60 * 60);
      this.cookies.set("userId", data.userUuid, 60 * 60);
    })
  },
  methods: {
    joinGame(): void {
      this.isJoinGameOpen = false;
      Emitter.emit('drawType', this.drawType);
      this.username += "-" + SocketInstance!.id.slice(0, 4);

      SocketInstance.emit("joinGame", { roomId: this.roomId, username: this.username })

      this.queueStatus = 'Joining';
      Emitter.emit('usernameChange', this.username)
    },

    cancelQueue(): void {
      this.queueStatus = 'Play';
      this.isJoinGameOpen = false;
      if (this.queueType === 'none') {
        return;
      }
      SocketInstance.emit('cancelQueue', this.queueType as Queue)
    },

    handleSelect(option: string) {
      console.log('Selected option:', option);
      this.isMenuOpen = false;
    },

    startLookingForGame(numPlayers: number) {
      console.log(`Looking for a game room for ${numPlayers} players...`);
      switch (numPlayers) {
        case 2:
          this.queueType = 'queue2'
          break;
        case 3:
          this.queueType = 'queue3'
          break;
        case 4:
          this.queueType = 'queue4'
          break;
        default:
          this.queueType = 'none';
          break;
      }
      this.isMenuOpen = false;
      if (this.queueType === 'none') {
        this.queueStatus = 'Play';
        return;
      }
      this.isJoinGameOpen = true;
      this.queueStatus = 'Searching game...';
      SocketInstance.emit("onQueue", this.queueType as Queue);
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
