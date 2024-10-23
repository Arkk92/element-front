import PlaceElementUseCase from "@/application/use-cases/PlaceElementUseCase";
import PlaceWizardUseCase from "@/application/use-cases/PlaceWizardUseCase";
import { ElementTypes } from "@/domain/game/models/elements/elements";
import { WaterModel } from "@/domain/game/models/elements/water";
import { PieceModel } from "@/domain/game/models/pieces/pieces";
import { SageModel } from "@/domain/game/models/pieces/sage";
import { PositionUtils } from "@/domain/game/utils/position_utils";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { usePlayerActionStore } from "./playerAction";
import { useRiverStore } from "./river";
import { useRoomStore } from "./room";

const placeElementUseCase = new PlaceElementUseCase();
const placeWizardUseCase = new PlaceWizardUseCase();

const defaultState = {};

export const usePieceStore = defineStore("piece", {
  state: () => {
    return { ...defaultState };
  },
  actions: {
    // Actions
    reset(): void {
      Object.assign(this, defaultState);
    },
    onElementClick(piece: PieceModel) {
      const authStore = useAuthStore();
      const playerActionStore = usePlayerActionStore();
      const riverStore = useRiverStore();

      if (riverStore.state == "ShowingRiversAvailable") {
        riverStore.chosingRiver(piece);
      } else {
        placeElementUseCase.execute(
          authStore.roomId,
          playerActionStore.elementSelected!.element_type,
          piece.position
        );
      }
    },
    onWizardClick(piece: PieceModel) {
      const playerActionStore = usePlayerActionStore();
      const roomStore = useRoomStore();
      const playerModel = roomStore.model.game.player_list.filter((player) =>
        PositionUtils.isSamePosition(player.sage.position, piece.position)
      );
      if (playerModel.length != 0) {
        if (playerActionStore.isWizardSelected()) {
          playerActionStore.unselectWizard();
        } else {
          playerActionStore.selectWizard(piece.position);
        }
      }
    },
    onEmptyCellClick(piece: PieceModel) {
      const playerActionStore = usePlayerActionStore();
      const riverStore = useRiverStore();
      if (riverStore.state == "None") {
        if (playerActionStore.isWizardSelected()) {
          this.placeWizard(piece as SageModel);
        }
        if (playerActionStore.isElementSelected()) {
          this.placeElement(
            piece,
            playerActionStore.elementSelected!.element_type
          );
        }
      } else if(riverStore.state === 'PlacingNewRiver'){
        /* Building river */
        riverStore.buildRiver(piece);
      }
    },

    // Water-specific logic for placing a water piece
    placeWater(piece: WaterModel): void {
      const riverStore = useRiverStore();
      const authStore = useAuthStore();
      const water = new WaterModel();
      water.position = piece.position;
      if (riverStore.isNextToWater(water)) {
        riverStore.reset();
        riverStore.placeWater(water);
      } else {
        placeElementUseCase.execute(
          authStore.roomId,
          ElementTypes.Water,
          piece.position
        );
      }
    },

    placeWizard(piece: SageModel) {
      const authStore = useAuthStore();
      const roomStore = useRoomStore();
      if (roomStore.model.game.turn.available_sage_moves > 0) {
        placeWizardUseCase.execute(
          authStore.roomId,
          piece.position,
          authStore.playerId
        );
      }
    },

    placeElement(piece: PieceModel, elementType: ElementTypes) {
      const authStore = useAuthStore();
      if (elementType === ElementTypes.Water) {
        this.placeWater(piece as WaterModel);
      } else {
        placeElementUseCase.execute(
          authStore.roomId,
          elementType,
          piece.position
        );
      }
    },
  },
});
