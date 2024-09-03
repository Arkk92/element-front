import { ClickedData, River } from "@/components/PlayerMenu/types";
import { WaterController } from "@/game/controllers/elements/water_controller";
import GridController from "@/game/controllers/grid_controller";
import { BoardModel } from "@/game/models/board";
import { WaterModel } from "@/game/models/elements/water";
import { PieceModel } from "@/game/models/pieces/pieces";
import { Position, PositionUtils } from "@/game/utils/position_utils";
import { Emitter } from "@/main";
import { nextTick } from "vue";

type WaterElementSM =
  | "None"
  | "WaterSelected"
  | "PlacingElement"
  | "ShowingRiversAvailable"
  | "PlacingNewRiver"
  | "SendingData";

class WaterUtils {
  waterElementSM: WaterElementSM;
  placedWater: WaterModel;
  oldRiver: River;
  newRiver: River;
  newRiverLength: number;
  lastWaterPlaced: Position;
  availableRivers: Array<River>;

  constructor() {
    this.waterElementSM = "None";
    this.placedWater = new WaterModel();
    this.oldRiver = [];
    this.newRiver = [];
    this.newRiverLength = 0;
    this.lastWaterPlaced = { row: 0, column: 0 };
    this.availableRivers = [];
  }

  placingWater(piece: WaterModel, board: BoardModel): void {
    const waterController: WaterController = new WaterController(
      piece as WaterModel
    );
    this.availableRivers = waterController.getRivers(
      board.grid,
      piece.position
    );
    const gridController: GridController = new GridController(board.grid);
    const water: WaterModel = new WaterModel();
    if (this.availableRivers.length == 0) {
      const clickedData: ClickedData = {
        piece: piece,
      };
      this.sendClickedCellData(clickedData);
      this.waterElementSM = "None";
    } else {
      water.position = piece.position;
      gridController.updateGridCell(water);

      for (const river of this.availableRivers) {
        Emitter.emit("riverHighlight", river);
      }

      this.waterElementSM = "ShowingRiversAvailable";
      this.placedWater = piece as WaterModel;
      Emitter.emit('sysLog', `Chose the river to move`)
    }
  }

  chosingRiver(piece: PieceModel, board: BoardModel): void {
    for (const river of this.availableRivers) {
      if (
        river.filter((water) =>
          PositionUtils.isSamePosition(water, piece.position)
        ).length > 0
      ) {
        this.oldRiver = river;
        this.newRiverLength = river.length + 1;
        this.waterElementSM = "PlacingNewRiver";
        this.lastWaterPlaced = this.placedWater.position;
        this.clearOldRiver(board);

        this.newRiver = [];

        nextTick(() => {
          // container IS finished rendering to the DOM
          Emitter.emit("oldRiverDisplay", this.oldRiver);
          Emitter.emit("riverHead", this.lastWaterPlaced);
          Emitter.emit("NewRiverAvailablePlacement", this.lastWaterPlaced);
        });
        Emitter.emit('sysLog', `Place the new river (${this.newRiverLength}) length`);
      }
    }
  }

  buildNewRiver(piece: PieceModel, board: BoardModel): void {
    const gridController: GridController = new GridController(board.grid);

    if (this.newRiverLength > 0) {
      if (
        PositionUtils.isStrictOrthogonalPosition(
          piece.position,
          this.lastWaterPlaced
        ) &&
        (gridController.isFireCell(piece.position) ||
          gridController.isPositionEmpty(piece.position)) &&
        this.oldRiver.filter((water) =>
          PositionUtils.isSamePosition(water, piece.position)
        ).length == 0
      ) {
        this.newRiver.push(piece.position);
        const water: WaterModel = new WaterModel();
        water.position = piece.position;
        gridController.updateGridCell(water);
        this.newRiverLength--;
        this.lastWaterPlaced = piece.position;
        Emitter.emit("NewRiverAvailablePlacement", this.lastWaterPlaced);
        Emitter.emit('sysLog', `Remaining river length ${this.newRiverLength}`)
      }
    }
    if (this.newRiverLength == 0) {
      const data: ClickedData = {
        piece: this.placedWater,
        oldRiver: this.oldRiver,
        newRiver: this.newRiver,
      };
      this.sendClickedCellData(data);
      this.waterElementSM = "None";
      
      Emitter.emit("oldRiverDisplayOff", this.oldRiver);
      
    }
  }

  sendClickedCellData(data: ClickedData): void {
    this.waterElementSM = "None";
    Emitter.emit("clickedCell", data);
  }

  clearOldRiver(board: BoardModel): void {
    const gridController: GridController = new GridController(board.grid);
    for (const water of this.oldRiver) {
      gridController.clearCell(water);
    }
  }
}

export default WaterUtils;
