<template>
  <div class="queue">
    <!-- Button trigger modal -->
    <div v-if="(queueStatus == 'Quick Play')">
      <NavButton v-on:click="isMenuOpen = true" :text="queueStatus" />
    </div>
    <div v-else-if="(queueStatus == 'Ranked Match')">
      <NavButton v-on:click="isMenuOpen = false" :text="queueStatus" :disabled="true" />
    </div>
    <div class="find-game-wrapper" v-else>
      <NavButton class="queue-status-button" :text="queueStatus" :disabled="true" />
    </div>
  </div>
  <PlayMenuModal :isOpen="isMenuOpen" @close="isMenuOpen = false" @start-game="startLookingForGame"
    @username="handleUsernameChange" :is-competitive="queueStatus == 'Ranked Match'" />
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

type QueueStatus = "Quick Play" | "Ranked Match" | "GameFound" | "Joining";
type QueueTypes = 'none' | 'queue2' | 'queue3' | 'queue4'

export default defineComponent({
  name: 'QueueComponent',
  components: {
    NavButton,
    PlayMenuModal,
    JoinGameModal,
  },
  props: {
    isRanked: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const { cookies } = useCookies();

    return {
      cookies
    };
  },
  data() {
    return {
      queueStatus: "Quick Play" as QueueStatus,
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
    this.queueStatus = this.isRanked ? 'Ranked Match' : 'Quick Play';

    SocketInstance.on("gameFound", (data: GameFound) => {
      if(this.isRanked){
        return;
      }
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

      SocketInstance.emit("joinGame", { roomId: this.roomId, username: this.username })

      this.queueStatus = 'Joining';
      Emitter.emit('joinGame')
    },

    cancelQueue(): void {
      this.queueStatus = 'Quick Play';
      this.isJoinGameOpen = false;
      if (this.queueType === 'none') {
        return;
      }
      SocketInstance.emit('cancelQueue', this.queueType as Queue)
    },

    handleUsernameChange(username: string) {
      this.username = username;
    },

    isOfQueueTypes (keyInput: string): keyInput is QueueTypes {
      return ['queue2', 'queue3', 'queue4'].includes(keyInput);
    },

    startLookingForGame(numPlayers: number) {

      const queueType = `queue${numPlayers}`

      if(!this.isOfQueueTypes(queueType)){
        this.queueType = 'none'
        this.queueStatus = this.isRanked ? 'Ranked Match' : 'Quick Play';
        return;
      } else {
        this.queueType = queueType;
      }
      this.isMenuOpen = false;
      
      if (this.username === '') {
        this.username = 'Guest-' + SocketInstance.id.slice(0, 4);
      }
      this.isJoinGameOpen = true;
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
