<template>
  <div class="room">
    2 Player game:
    <button v-on:click="startQueueSearch('queue2')">{{queueStatus}}</button>
    <br>
    <br>
    <button v-on:click="forceUpdateRoom()">Actualizar</button>
    <Player :player_number="1" :socket="socket"></Player>
    <br>
    <Player :player_number="2"></Player>


    <div v-if="data_ready == true">
      <BoardVue :board="game.board">
      </BoardVue>

      <br>
      Turn: Player {{ game.turn_player.player_number + 1 }}, Status:
    </div>
    {{ room }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BoardVue from './Board.vue';
import Player from './Player.vue';
import { RoomModel, RoomModelMap } from '@/game/models/room';
import { JoinQueue, QueueTypes } from '@/sockets/client'
import { SocketInstance } from '@/main'

export default defineComponent({
  name: 'RoomComponent',
  components: {
    BoardVue,
    Player
  },
  data() {
    return {
      queueStatus: "Play!",
      roomId: "",
      data_ready: false,
      uuid: "",
      game: null,
      user_map_list: new Map(),
      room: new RoomModel(0),

    }
  },
  mounted() {
    SocketInstance.on("gameUpdate", (data) => {
      console.log(data)

      this.uuid = data.room.uuid;
      this.game = data.room.game;
      this.user_map_list = data.room.user_map_list;

      console.log(this.game)
      const room: RoomModel = new RoomModelMap().toDomain(data.room);
      Object.assign(this.room, room);

      this.data_ready = true;
    })

    SocketInstance.on("gameFound", (roomId: string) => {
      this.roomId = roomId;
      this.queueStatus = "In game Room"
    })
  },
  methods: {
    startQueueSearch(queue_type: string): void {

      const queueData: JoinQueue = {
        queue: queue_type as QueueTypes
      };

      SocketInstance.emit("onQueue", queueData);
      this.queueStatus = "In queue..."
    },
    forceUpdateRoom(): void {
      SocketInstance.emit('forceGameUpdate', "room1");
    },
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
