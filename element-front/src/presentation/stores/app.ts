import { defineStore } from "pinia";

type AppStates = "Loading" | "MainMenu" | "InGame";

const defaultState = {
  state: "Loading" as AppStates,
};

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      ...defaultState,
    };
  },
  getters: {
    getState(): AppStates {
      return this.state;
    },
  },
  actions: {
    reset() {
      this.state = "Loading";
    },
    onLoadingFinished() {
      this.state = "MainMenu";
    },
    onGameStart() {
      this.state = "InGame";
    },
    onGameEnd() {
      this.state = "MainMenu";
    },
  },
});
