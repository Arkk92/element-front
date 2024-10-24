import PlaceRiverUseCase from "@/application/use-cases/PlaceRiverUseCase";
import { WaterController } from "@/domain/game/controllers/elements/water_controller";
import GridController from "@/domain/game/controllers/grid_controller";
import { WaterModel } from "@/domain/game/models/elements/water";
import { PieceModel } from "@/domain/game/models/pieces/pieces";
import { PositionUtils } from "@/domain/game/utils/position_utils";
import RiverController from "@/domain/river/RiverController";
import { RiverModel } from "@/domain/river/RiverModel";
import { Emitter } from "@/main";
import { River, RiverData } from "@/shared/types/types";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useRoomStore } from "./room";

type RiverFormationState =
  | "None"
  | "ShowingRiversAvailable"
  | "PlacingNewRiver";

const placeRiverUseCase = new PlaceRiverUseCase();

const defaultState = {
  state: "None" as RiverFormationState,
  model: new RiverModel(),
  availableRivers: [] as Array<River>,
};

export const useRiverStore = defineStore("river", {
  state: () => {
    return { ...defaultState };
  },
  actions: {
    // Actions
    reset(): void {
      Object.assign(this, defaultState);
    },

    isNextToWater(piece: WaterModel) {
      const roomStore = useRoomStore();
      const grid = roomStore.model.game.board.grid;
      const waterController = new WaterController(piece);
      const availableRivers = waterController.getRivers(grid, piece.position);
      return availableRivers.length != 0;
    },

    placeWater(piece: WaterModel): void {
      const roomStore = useRoomStore();
      const waterController = new WaterController(piece);
      const gridModel = roomStore.model.game.board.grid;
      const gridController = new GridController(gridModel);
      gridController.updateGridCell(piece);
      this.availableRivers = waterController.getRivers(gridModel, piece.position);
      this.state = "ShowingRiversAvailable";
      this.model.placedWater = piece;
      Emitter.emit("sysLog", `Chose the river to move`);
    },

    chosingRiver(piece: PieceModel): void {
      const riverController = new RiverController(this.model);
      const selectedRiver = this.availableRivers.find((river) =>
        river.some((water) =>
          PositionUtils.isSamePosition(water, piece.position)
        )
      );

      if (selectedRiver) {
        riverController.startNewRiver(
          selectedRiver,
          this.model.placedWater.position
        );
        this.clearOldRiver();
        this.state = "PlacingNewRiver";
      }
    },

    buildRiver(piece: PieceModel): void {
      const roomStore = useRoomStore();
      const riverController = new RiverController(this.model);
      const water = new WaterModel();
      water.position = piece.position;
      const gridController = new GridController(
        roomStore.model.game.board.grid
      );
      if (
        riverController.canPlaceNextRiverSegment(piece.position, gridController)
      ) {
        riverController.addSegmentToRiver(water, gridController);
      }

      if (riverController.isRiverComplete()) {
        this.finalizeRiver();
      }
    },

    finalizeRiver(): void {
      const authStore = useAuthStore();
      const riverController = new RiverController(this.model);
      const riverData: RiverData = {
        newRiver: riverController.getRiver(),
        oldRiver: riverController.getOldRiver(),
      };
      placeRiverUseCase.execute(
        authStore.roomId,
        riverController.getPlaceWater(),
        riverData
      );
      this.reset();
      this.state = "None";
      Emitter.emit("RiverFinished", riverController.getOldRiver());
    },

    clearOldRiver(): void {
      const roomStore = useRoomStore();
      const grid = roomStore.model.game.board.grid;
      const gridController: GridController = new GridController(grid);
      const riverController = new RiverController(this.model);
      for (const water of riverController.getOldRiver()) {
        gridController.clearCell(water);
      }
    },
    undoRiverSegment(): void {
      const roomStore = useRoomStore();
      const grid = roomStore.model.game.board.grid;
      const gridController: GridController = new GridController(grid);
      const riverController = new RiverController(this.model);
      riverController.undoLastRiverSegment(gridController);
    },
    cancelRiver(): void {
      const roomStore = useRoomStore();
      const grid = roomStore.model.game.board.grid;
      const gridController: GridController = new GridController(grid);
      const riverController = new RiverController(this.model);
      riverController.undoAllRiverSegments(gridController);
      riverController.restoreOldRiver(gridController);
      this.state = 'ShowingRiversAvailable';
    }
  },
});
