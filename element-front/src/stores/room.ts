import { RoomModel, RoomModelMap } from "@/game/models/room";
import { defineStore } from "pinia";

import { Emitter } from "@/main";
import { PublicServerResponse } from "@/schemas/server_response";
import { useCookies } from "vue3-cookies";
import { useGameStore } from "./game";
import { Queue } from "@/sockets/socketUtils";

export type GameType = "Quick Match" | "Ranked Match" | "Custom Match";
export type RoomState =
  | "Idle"
  | "Searching"
  | "GameFound"
  | "Joining"
  | "Re-Joining";

const defaultState = {
  roomModel: new RoomModel(0),
  roomSize: "queue4" as Queue,
  roomState: "Quick Play" as RoomState,
  gameType: "Quick Match" as GameType,
  username: "Guest",
};

export const useRoomStore = defineStore("room", {
  state: () => {
    return {
      ...defaultState
    };
  },
  getters: {
    getRoomId(): string {
      return this.roomModel.uuid;
    },
    getRoomState(): RoomState {
      return this.roomState;
    },
    getGameType(): GameType {
      return this.gameType;
    },
    isRankedGame(): Boolean {
      return this.gameType === "Ranked Match";
    },
    getTurnUserId(): string {
      const gameStore = useGameStore()
      const turnPlayerId = gameStore.getTurnPlayerId()
      for (const user of this.roomModel.user_to_player_map) {
        if (user.player_uuid == turnPlayerId) {
          return user.user_uuid;
        }
      }
      return "";
    },
  },
  actions: {
    reset(){
      const gameStore = useGameStore();
      Object.assign(this, defaultState);
      gameStore.reset()
    },
    updateFromServerResponse(data: PublicServerResponse) {
      const gameStore = useGameStore();
      this.roomModel = new RoomModelMap().toDomain(data.room);
      gameStore.updateGameModel(this.roomModel.game);
      gameStore.setTurnPlayerId(data.player_turn_uuid);
      if (data.winner != null) {
        gameStore.setWinner(data.winner);
        setTimeout(() => {
          const { cookies } = useCookies();
          cookies.remove("roomId");
          cookies.remove("userId");
        }, 2000);
      }
      Emitter.emit("RoomUpdate");
    },
    updateRoomState(state: RoomState) {
      switch (state) {
        case "Idle":
          if (this.roomState === "Searching") {
            Emitter.emit("CancelGameSearching");
          }
          break;
        case "Searching":
          Emitter.emit("SearchingGame");
          break;
        case "GameFound":
          Emitter.emit("GameFound");
          break;
        case "Joining":
          Emitter.emit("GameAccepted");
          break;
        case "Re-Joining":
          Emitter.emit("ReJoiningGame");
          break;
      }
      this.roomState = state;
      Emitter.emit("RoomStateChange");
    },
    setRoomId(roomId: string) {
      this.roomModel.uuid = roomId;
      Emitter.emit("RoomIdChange");
    },
  },
});
