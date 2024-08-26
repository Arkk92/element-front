<template>
  <div class="queue">
    <!-- Button trigger modal -->
    <div v-if="(queueStatus == 'Find game')">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#queueSelectorModal">
        {{ queueStatus }}
      </button>
    </div>
    <div v-else>
      <button type="button" class="btn btn-secondary" disabled>
        Room ID: {{ roomId }}
      </button>
    </div>
    <!-- Modals -->
    <teleport to="body">
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
              <div class="row" v-if="(queueStatus === 'Find game')">
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
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Emitter, SocketInstance } from '@/main'
import { GameFound, Queue, UserAuthData } from '@/sockets/socketUtils';
import { useCookies } from "vue3-cookies";

type QueueStatus = "Find game" | "Game found" | "Searching game..." | "Playing";
type QueueTypes = 'none' | 'queue2' | 'queue3' | 'queue4'

export default defineComponent({
  name: 'QueueComponent',
  components: {
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      queueStatus: "Find game" as QueueStatus,
      queueType: "none" as QueueTypes,
      roomId: "",
      drawType: 'random',
      username: "Guest",
      usernameError: '',

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
        this.username += "-" + SocketInstance.id.slice(0, 4);
      }
      SocketInstance.emit("joinGame", { roomId: this.roomId, username: this.username })
      this.queueStatus = 'Playing';
      Emitter.emit('usernameChange', this.username)
    },

    cancelQueue(): void {
      this.queueStatus = 'Find game';
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
      this.queueStatus = "Find game";
      this.queueType = "none";
      this.roomId = "";
      this.cancelQueue();
    },

    checkUserName() {
      this.usernameError = '';
      if ((this.username.length < 3) || (this.username.length > 10)) {
        this.usernameError = 'The length of the Nickname must be between 3 to 10 characters.'
      }
    }


  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
