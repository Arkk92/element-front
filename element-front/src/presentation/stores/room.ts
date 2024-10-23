import { RoomModel, RoomModelMap } from "@/domain/game/models/room";
import { defineStore } from "pinia";

import GameUpdateUseCase from "@/application/use-cases/GameUpdateUseCase";
import { PublicServerResponse } from "@/infra/schemas/server_response";
import { emitGameUpdateRequest, onGameUpdated } from "@/infra/sockets/services/game/gameUpdateSocket";
import { Queue } from "@/infra/sockets/socketUtils";
import { useCookies } from "vue3-cookies";
import { useAuthStore } from "./auth";
import { Emitter } from "@/main";
import { usePlayerActionStore } from "./playerAction";
import { GridModel } from "@/domain/game/models/grid";
import { useQueueStore } from "./queue";

export type GameType = "Quick Match" | "Ranked Match" | "Custom Match";

const roomModelMap = new RoomModelMap();
const gameUpdateUseCase = new GameUpdateUseCase(roomModelMap);

const defaultState = {
  model: new RoomModel(0),
  roomSize: "queue4" as Queue,
  username: "Guest",
  turnPlayerId: "",
  winner: null as string | null,
};

export const useRoomStore = defineStore("room", {
  state: () => {
    return {
      ...defaultState,
    };
  },
  getters: {
    getRoomId(): string {
      return this.model.uuid;
    },
    getTurnUserId(): string {
      const turnPlayerId = this.turnPlayerId;
      for (const user of this.model.user_to_player_map) {
        if (user.player_uuid == turnPlayerId) {
          return user.user_uuid;
        }
      }
      return "";
    },
  },
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    updateRoomFromSocket(roomData: PublicServerResponse | null) {
      const playerActionStore = usePlayerActionStore();
      const queueStore = useQueueStore();
      queueStore.playing()
      if(roomData == null) return;
      const roomModel = gameUpdateUseCase.execute(roomData);
      this.model = roomModel;
      this.turnPlayerId = roomData.player_turn_uuid;
      playerActionStore.reset();
      playerActionStore.elementList = roomModel.game.turn.chosen_elements;
      if (roomData.winner) {
        this.winner = roomData.winner;
        setTimeout(() => {
          const { cookies } = useCookies();
          cookies.remove("roomId");
          cookies.remove("userId");
        }, 2000);
      }
      // Emitter.emit("GameUpdate");
    },
    setRoomId(roomId: string) {
      this.model.uuid = roomId;
    },
    checkForReconnection(){
      const authStore = useAuthStore();
      if(authStore.roomId != null){
        /* Existing session try to reconnect */
        emitGameUpdateRequest();
      }
    },

    listenForRoomUpdates() {
      // Listen for socket events and update the store
      onGameUpdated(this.updateRoomFromSocket);
    },
  },
});
