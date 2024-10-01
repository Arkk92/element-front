import { ClickedData, River } from "@/components/PlayerMenu/types";
import { WaterController } from "@/game/controllers/elements/water_controller";
import GridController from "@/game/controllers/grid_controller";
import { BoardModel } from "@/game/models/board";
import { WaterModel } from "@/game/models/elements/water";
import { IPieceModel, PieceModel } from "@/game/models/pieces/pieces";
import { Position, PositionUtils } from "@/game/utils/position_utils";
import { Emitter } from "@/main";
import { nextTick } from "vue";

type PieceStateMachine =
  "None"
  | "SageSelected"
  | "WaterSelected"
  | "PlacingElement"
  | "ShowingRiversAvailable"
  | "PlacingNewRiver"
  | "SendingData"
  | 'Undoing';

class PieceManager {
  state: PieceStateMachine;
  placedWater: WaterModel;
  oldRiver: River;
  newRiver: River;
  newRiverPreviousPieces: Array<IPieceModel>;
  newRiverLength: number;
  lastWaterPlaced: Position;
  availableRivers: Array<River>;

  constructor() {
    this.state = "None";
    this.placedWater = new WaterModel();
    this.oldRiver = [];
    this.newRiver = [];
    this.newRiverLength = 0;
    this.lastWaterPlaced = { row: 0, column: 0 };
    this.availableRivers = [];
    this.newRiverPreviousPieces = [];
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
      this.state = "None";
    } else {
      water.position = piece.position;
      gridController.updateGridCell(water);

      for (const river of this.availableRivers) {
        Emitter.emit("riverHighlight", river);
      }

      this.state = "ShowingRiversAvailable";
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
        this.state = "PlacingNewRiver";
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
        this.newRiverPreviousPieces.push(gridController.getGridCellByPosition(piece.position));
        this.newRiver.push(piece.position);
        const water: WaterModel = new WaterModel();
        water.position = piece.position;
        gridController.updateGridCell(water);
        this.newRiverLength--;
        this.lastWaterPlaced = piece.position;
        // Next tick required to leave time to render the new water placed
        nextTick(() => {
          Emitter.emit("NewRiverAvailablePlacement", this.lastWaterPlaced);
          Emitter.emit('sysLog', `Remaining river length ${this.newRiverLength}`)
        })
      }
    }
    if (this.newRiverLength == 0) {
      const data: ClickedData = {
        piece: this.placedWater,
        oldRiver: this.oldRiver,
        newRiver: this.newRiver,
      };
      this.sendClickedCellData(data);
      this.state = "None";
      
      Emitter.emit("oldRiverDisplayOff", this.oldRiver);
      
    }
  }

  sendClickedCellData(data: ClickedData): void {
    this.state = "None";
    Emitter.emit("clickedCell", data);
  }

  clearOldRiver(board: BoardModel): void {
    const gridController: GridController = new GridController(board.grid);
    for (const water of this.oldRiver) {
      gridController.clearCell(water);
    }
  }

  restoreOldRiver(board: BoardModel): void {
    const gridController: GridController = new GridController(board.grid);

    for ( const waterPos of this.oldRiver){
      const water: WaterModel = new WaterModel();
      water.position = waterPos;
      gridController.updateGridCell(water);
    }
  }

  restoreNewRiver(board: BoardModel): void {
    const gridController: GridController = new GridController(board.grid);
    for (const piece of this.newRiverPreviousPieces){
      gridController.updateGridCell(piece);
    }
  }

  resetBuldingRiver(board: BoardModel): void {
    this.restoreNewRiver(board);
    this.restoreOldRiver(board);
    nextTick(()=>{
      this.placingWater(this.placedWater, board);
      // Negative positions to reset empty spaces
      Emitter.emit('NewRiverAvailablePlacement', {row: -2, column: -2})
    })
  }

  cancelBuildingRiver(board: BoardModel): void {
    this.restoreNewRiver(board);
    this.restoreOldRiver(board);
    const gridController: GridController = new GridController(board.grid);
    gridController.clearCell(this.placedWater.position)
    nextTick(()=>{
      // Negative positions to reset empty spaces
      Emitter.emit('NewRiverAvailablePlacement', {row: -2, column: -2});
      this.state = "None";
      Emitter.emit('sysLog', `River cancelled`)
    })

  }

  undoRiverBuildingStep(board: BoardModel): void {
    const gridController: GridController = new GridController(board.grid);
    if(this.newRiver.length == 0){
      Emitter.emit('sysLog', `Nothing to undo`)
      // No new river under construction, nothing to undo
      return;
    }
    // Remove last placed river water
    this.newRiver.pop();
    this.newRiverLength++;
    // Restore the previous element in that position
    const piece: IPieceModel | undefined = this.newRiverPreviousPieces.pop();
    if(piece !== undefined){
      gridController.updateGridCell(piece);
    }
    if(this.newRiver.length == 0){
      this.lastWaterPlaced = this.placedWater.position;
    } else {
      this.lastWaterPlaced = this.newRiver[this.newRiver.length - 1]
    }
    nextTick(()=> {
      Emitter.emit("riverHead", this.lastWaterPlaced);
      Emitter.emit("NewRiverAvailablePlacement", this.lastWaterPlaced);
    })
  }
}

export default PieceManager;
