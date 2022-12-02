<template>
  <div class="queue">
    <!-- Button trigger modal -->
    <div v-if="(queueStatus == 'Find game')">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#queueSelectorModal">
        {{ queueStatus }}
      </button>
    </div>
    <div v-else>
      <button type="button" class="btn btn-primary" v-on:click="cancelQueue()">
        {{ queueStatus }}
        <i class="bi-x-circle-fill" role="img" aria-label="CancelQueue"></i>

      </button>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="queueSelectorModal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Find Game</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Select the type of game you want to play:
            <br>
            <div class="btn-group" role="group" aria-label="Game types button group">
              <button type="button" class="btn btn-outline-primary" :class="queueType == 'queue2' ? 'active' : ''"
                v-on:click="queueType = 'queue2'">2 player
                game
              </button>

              <button type="button" class="btn btn-outline-primary" :class="queueType == 'queue3' ? 'active' : ''"
                v-on:click="queueType = 'queue3'">3 player
                game
              </button>
              <button type="button" class="btn btn-outline-primary" :class="queueType == 'queue4' ? 'active' : ''"
                v-on:click="queueType = 'queue4'">4 player
                game
              </button>
            </div>
          </div>


          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
              v-on:click="startQueueSearch()">Play!</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { JoinQueue, QueueTypes } from '@/sockets/client'
import { SocketInstance } from '@/main'

export default defineComponent({
  name: 'QueueComponent',
  components: {
  },
  setup() {

  },
  data() {
    return {
      queueStatus: "Find game",
      queueType: "queue2",
      roomId: "",

    }
  },
  mounted() {

    SocketInstance.on("gameFound", (roomId: string) => {
      this.roomId = roomId;
      this.queueStatus = "Game found";
    })
  },
  methods: {
    startQueueSearch(): void {

      const queueData: JoinQueue = {
        queue: this.queueType as QueueTypes
      };

      SocketInstance.emit("onQueue", queueData);
      this.queueStatus = "Looking for a game...";
    },
    cancelQueue(): void {
      // TBD
      this.queueStatus = "Find game";
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
