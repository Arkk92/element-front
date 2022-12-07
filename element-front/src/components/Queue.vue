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
        Room ID: {{roomId}}
      </button>
    </div>
    <!-- Modals -->
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
              Searching for a game...
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SocketInstance } from '@/main'
import { GameFound, Queue } from '@/sockets/socketUtils';

type QueueStatus = "Find game" | "Game found" | "Searching game..." | "Playing";
type QueueTypes = 'none' | 'queue2' | 'queue3' | 'queue4'

export default defineComponent({
  name: 'QueueComponent',
  components: {
  },
  setup() {

  },
  data() {
    return {
      queueStatus: "Find game" as QueueStatus,
      queueType: "none" as QueueTypes,
      roomId: "",

    }
  },
  mounted() {

    SocketInstance.on("gameFound", (data: GameFound) => {
      this.roomId = data.roomId;
      this.queueStatus = 'Game found';
    })
  },
  methods: {
    startQueueSearch(): void {

      SocketInstance.emit("onQueue", this.queueType as Queue);
      this.queueStatus = 'Searching game...';
    },
    joinGame(): void {
      SocketInstance.emit("joinGame", { roomId: this.roomId })
      this.queueStatus = 'Playing';
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

    closeModal(){
      this.queueStatus = "Find game";
      this.queueType = "none";
      this.roomId = "";
      this.cancelQueue();
    }


  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
