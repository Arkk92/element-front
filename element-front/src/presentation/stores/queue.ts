import { emitGameUpdateRequest } from "@/infra/sockets/services/game/gameUpdateSocket";
import { emitCancelSearchingGame } from "@/infra/sockets/services/queue/cancelSearchingGameSocket";
import { onGameFound } from "@/infra/sockets/services/queue/gameFoundSocket";
import { emitJoinGame } from "@/infra/sockets/services/queue/joinGameSocket";
import { emitSearchGame } from "@/infra/sockets/services/queue/searchGameSocket";

import { GameFound, JoinGameData, Queue } from "@/infra/sockets/socketUtils";
import { SocketInstance } from "@/main";
import { defineStore } from "pinia";

export type GameType = "Quick" | "Ranked" | "Custom";
type QueueState = "Idle" | "Searching" | "Game Found" | "Game Joined" | "Playing";

const defaultState = {
  roomId: "",
  roomSize: "queue4" as Queue,
  gameType: "Quick" as GameType,
  queueState: "Idle" as QueueState,
};

export const useQueueStore = defineStore("queue", {
  state: () => {
    return {
      ...defaultState,
    };
  },
  getters: {
    getGameType(): GameType {
      return this.gameType;
    },
    isRankedGame(): Boolean {
      return this.gameType === "Ranked";
    },
  },
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },

    searchGame(roomSize: Queue) {
      emitSearchGame(roomSize);
      this.roomSize = roomSize;
      this.queueState = "Searching";
    },

    gameFound(data: GameFound) {
      this.roomId = data.roomId;
      this.queueState = "Game Found";
    },

    joinGame(username: string) {
      let _username = username;
      if (_username == "") {
        _username = `Guest-${SocketInstance.id.slice(0, 4)}`;
      }
      const data: JoinGameData = { roomId: this.roomId, username: _username };
      emitJoinGame(data);
      this.queueState = "Game Joined";
    },

    reJoinGame() {
      this.queueState = "Game Joined";
      emitGameUpdateRequest();
    },

    cancelQueue() {
      emitCancelSearchingGame(this.roomSize);
      this.queueState = "Idle";
    },

    playing(): void {
      this.queueState = 'Playing';
    },

    listenForGameFound() {
      // Listen for socket events and update the store
      onGameFound(this.gameFound);
    },
  },
});
