<template>
  <div class="settings">
    <!-- Button trigger modal -->
    <div>
      <!-- <NavButton :text="queueStatus" data-bs-toggle="modal" data-bs-target="#queueSelectorModal"/> -->
      <NavButton v-on:click="isMenuOpen = true" :text="'Settings'" :disabled="true"/>
    </div>

    <!-- <div v-else>
      <button type="button" class="btn btn-secondary" disabled>
        Room ID: {{ roomId }}
      </button>
    </div> -->
    <!-- Modals -->
    <!-- <teleport to="body">
      <div class="modal fade" id="queueSelectorModal" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Find Game</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="queueStatus !== 'Game found'">
              <div class="row">
                <div class="col">
                  Nickname:
                </div>
                <div class="col">
                  <input type="text" class="form-control" v-model="username">
                  <div v-if="usernameError != ''">
                    <span style="color:red">{{ usernameError }}</span>
                  </div>
                </div>

              </div>
              <br>
              <div class="row">
                Select the type of game you want to play:
                <br>
              </div>
              <div class="row">
                <div class="btn-group" role="group" aria-label="Game types button group">
                  <a type="button" class="btn btn-outline-primary" :class="getModelQueueButtonsStyle('queue2')"
                    v-on:click="queueType = 'queue2'">2 player
                    game
                  </a>

                  <a type="button" class="btn btn-outline-primary" :class="getModelQueueButtonsStyle('queue3')"
                    v-on:click="queueType = 'queue3'">3 player
                    game
                  </a>
                  <a type="button" class="btn btn-outline-primary" :class="getModelQueueButtonsStyle('queue4')"
                    v-on:click="queueType = 'queue4'">4 player
                    game
                  </a>
                </div>
              </div>
              <hr>
              <div class="row" v-if="(queueStatus === 'Play')">
                <a type="button" class="btn btn btn-success" :class="queueType === 'none' ? 'disabled' : ''"
                  v-on:click="startQueueSearch()">Play!</a>
              </div>
              <div class="row" v-else>
                <div class="col-3">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div class="col">
                  Waiting for other people to join the room...
                </div>
                <button type="button" class="btn btn btn-danger" v-on:click="cancelQueue()">
                  <i class="bi-x-circle-fill" role="img" aria-label="CancelQueue"></i>
                  Cancel</button>

              </div>
            </div>
            <div class="modal-body" v-else>
              Game found
              <br>
              {{ roomId }}
              <br>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="joinGame()">Join
                in!</button>
            </div>


            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                v-on:click="closeModal()">Close</button>
            </div>
          </div>
        </div>
      </div>
    </teleport> -->
  </div>
  <!-- <PlayMenuModal :isOpen="isMenuOpen" @close="isMenuOpen = false" @start-game="startLookingForGame"  @select="handleSelect" /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Emitter, SocketInstance } from '@/main'
import { GameFound, Queue, UserAuthData } from '@/sockets/socketUtils';
import { useCookies } from "vue3-cookies";
import NavButton from '@/components/NavButton.vue';
// import PlayMenuModal from './PlayMenuModal.vue';

type QueueStatus = "Play" | "Game found" | "Searching game..." | "Playing";
type QueueTypes = 'none' | 'queue2' | 'queue3' | 'queue4'

export default defineComponent({
  name: 'SettingsComponent',
  components: {
    NavButton,
    // PlayMenuModal
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

    }
  },
  mounted() {

    if (this.cookies.get("roomId") != null) {
      this.roomId = this.cookies.get("roomId")
    }
    if (this.roomId !== "") {
      this.queueStatus = 'Playing';
    }

    SocketInstance.on("gameFound", (data: GameFound) => {
      this.roomId = data.roomId;
      this.queueStatus = 'Game found';
      Emitter.emit('drawType', this.drawType);
    })

    SocketInstance.on('userAuthData', (data: UserAuthData) => {
      this.cookies.set("roomId", data.roomUuid, 60 * 60);
      this.cookies.set("userId", data.userUuid, 60 * 60);
    })
  },
  watch: {
    username() {
      this.checkUserName();
    }
  },
  methods: {
    startQueueSearch(): void {

      SocketInstance.emit("onQueue", this.queueType as Queue);
      this.queueStatus = 'Searching game...';
    },
    joinGame(): void {
      if (this.username === 'Guest') {
        this.username += "-" + SocketInstance!.id.slice(0, 4);
      }
      SocketInstance.emit("joinGame", { roomId: this.roomId, username: this.username })
      this.queueStatus = 'Playing';
      Emitter.emit('usernameChange', this.username)
    },

    cancelQueue(): void {
      this.queueStatus = 'Play';
    },

    getModelQueueButtonsStyle(queue: string): string {
      let style_str: string = "";
      if (queue === this.queueType) {
        style_str += 'active';
      } else if (this.queueStatus === 'Searching game...') {
        style_str += 'btn-outline-light disabled';
      }
      return style_str;
    },

    closeModal() {
      this.queueStatus = "Play";
      this.queueType = "none";
      this.roomId = "";
      this.cancelQueue();
    },

    checkUserName() {
      this.usernameError = '';
      if ((this.username.length < 3) || (this.username.length > 10)) {
        this.usernameError = 'The length of the Nickname must be between 3 to 10 characters.'
      }
    },

    handleSelect(option: string) {
      console.log('Selected option:', option);
      this.isMenuOpen = false;
    },

    startLookingForGame(numPlayers: number){
      console.log(`Looking for a game room for ${numPlayers} players...`);
      this.isMenuOpen = false;
      this.queueStatus = 'Searching game...';
      SocketInstance.emit("onQueue", this.queueType as Queue);
    }


  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settings {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
