<template>
  <div class="alert alert-danger" role="alert" v-show="showingError">
    {{ error }}
  </div>

  <div class="room-layout">
    <div class="row" v-if="data_ready">
      <div class="col-md-3">
        <UserLayout :user-list="roomData.user_list" :turn-user-id="getTurnUserId()"
          :turn="roomData.game.turn" :user-to-player-map="roomData.user_to_player_map" :player-list="roomData.game.player_list" />
      </div>
      <div class="col">
        <GameLayout :game="roomData.game" :is-user-turn="isCurrentUserTurn()"
          :current-player-id="getPlayerIdByUserId(getUserId())" :room-id="roomData.uuid"></GameLayout>
      </div>
      <div class="col">
        <ChatLayout :room-id="roomData.uuid"></ChatLayout>
      </div>
      <WinnerLayout v-if="isGameOver" :current-user="getUserId()" :room="roomData" :winner="winner"></WinnerLayout>
    </div>
  </div>
<div class="info" v-if="!data_ready">
<div>
  <h1 class="sweet-title">
    <span data-text="Element Board Game">Element Board Game</span>
    <br>
    <span data-text="Now online!">Now online!</span>
  </h1>
</div>
  <a href="https://ratherdashinggames.com/games/element.html" target="_blank">Find the rules here!</a>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCookies } from "vue3-cookies";
import { SocketInstance } from '@/main';
import { RoomModel, RoomModelMap } from '@/game/models/room';
import UserLayout from './UserLayout.vue';
import GameLayout from './gameLayout.vue';
import ChatLayout from './chatLayout.vue';
import WinnerLayout from './WinnerLayout.vue';


let room: RoomModel;

export default defineComponent({
  name: 'RoomLayout',
  components: {
    UserLayout,
    GameLayout,
    ChatLayout,
    WinnerLayout
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      username: "Username",
      data_ready: false,
      roomData: room,
      turn_player_uuid: "",
      error: "",
      showingError: false,
      isGameOver: false,
      winner: '',
    }
  },
  mounted() {
    SocketInstance.on("gameUpdate", (data) => {
      // console.log("Game update: ")
      // console.log(data)

      if (data != null) {
        room = new RoomModelMap().toDomain(data.room);
        this.roomData = room;
        this.turn_player_uuid = data.player_turn_uuid;

        if (data.winner != null) {
          this.isGameOver = true;
          this.winner = data.winner!
          setTimeout(() => { 
            this.cookies.remove('roomId');
            this.cookies.remove('userId');
          }, 2000);

        }
        this.data_ready = true;


      }
    }),
      SocketInstance.on('error', async (data) => {
        //console.log(data);
        if (data) {
          this.error = data.message as string;
          this.showingError = true;
        }
        setTimeout(() => {
          this.error = "";
          this.showingError = false;
        }, 5000)
      }),

      SocketInstance.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
});

  },

  methods: {
    getUserId(): string {
      return this.cookies.get("userId");
    },
    getTurnUserId(): string {

      for (let user of this.roomData.user_to_player_map) {
        if (user.player_uuid == this.turn_player_uuid) {
          return user.user_uuid;
        }
      }
      return "";
    },
    isCurrentUserTurn(): boolean {
      return this.getUserId() === this.getTurnUserId();
    },
    getPlayerIdByUserId(userId: string): string {
      for (let user of this.roomData.user_to_player_map) {
        if (userId === user.user_uuid) {
          return user.player_uuid;
        }
      }
      return ""
    }

  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 80vh;
}

.sweet-title {
  order: 2;
  color: #00afd1;
  font-weight: 900;
  text-transform: uppercase;
  font-size: clamp(3rem, 10vw, 6rem);
  line-height: 0.75em;
  text-align: center;
  text-shadow: 3px 1px 1px #00f9ff, 2px 2px 1px #002136, 4px 2px 1px #00f9ff,
    3px 3px 1px #002136, 5px 3px 1px #00f9ff, 4px 4px 1px #002136,
    6px 4px 1px #00f9ff, 5px 5px 1px #002136, 7px 5px 1px #00f9ff,
    6px 6px 1px #002136, 8px 6px 1px #00f9ff, 7px 7px 1px #002136,
    9px 7px 1px #00f9ff;

  span {
    display: block;
    position: relative;

    &:before {
      content: attr(data-text);
      position: absolute;
      text-shadow: 2px 2px 1px #e94aa1, -1px -1px 1px #c736f9,
        -2px 2px 1px #e94aa1, 1px -1px 1px #f736f9;
      z-index: 1;
    }

    &:nth-child(1) {
      padding-right: 2.25rem;
    }

    &:nth-child(2) {
      padding-left: 2.25rem;
    }
  }
}
</style>
