import { GameModel, GameModelMap, IGameModel } from "@/game/models/game";
import { TurnStates } from "@/game/models/turn";
import { Emitter } from "@/main";
import { defineStore } from "pinia";

const defaultState = {
  turnPlayerId: "",
  winner: null as string | null,
  gameModel: new GameModel(),
};

export const useGameStore = defineStore("game", {
  state: () => {
    return { ...defaultState };
  },
  getters: {},
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    updateGameModel(game: IGameModel) {
      this.gameModel = new GameModelMap().toDomain(game);
      console.log(this.gameModel.turn.remainingTurnTime);
      setTimeout(() => {
        Emitter.emit("GameUpdate");
      }, 100);
    },
    setWinner(winner: string) {
      this.winner = winner;
    },
    setTurnPlayerId(playerId: string) {
      this.turnPlayerId = playerId;
    },
    getTurnState(): TurnStates {
      return this.gameModel.turn.state;
    },
    getTurnPlayerId(): string {
      return this.turnPlayerId;
    },
    getRemainingTurnTime(): number {
      return this.gameModel.turn.remainingTurnTime;
    },
  },
});
