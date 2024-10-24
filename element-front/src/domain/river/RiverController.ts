import GridController from "@/domain/game/controllers/grid_controller";
import { WaterModel } from "@/domain/game/models/elements/water";
import { Position, PositionUtils } from "@/domain/game/utils/position_utils";
import { River } from "@/shared/types/types";
import { RiverModel } from "./RiverModel";

class RiverController {
  constructor(private model: RiverModel) {}

  startNewRiver(river: River, lastWaterPlaced: Position): void {
    const water = new WaterModel();
    water.position = lastWaterPlaced;
    this.model.placedWater = water;
    this.model.oldRiver = river;
    this.model.riverLength = river.length + 1;
    this.model.lastWaterPlaced = lastWaterPlaced;
    this.model.river = [];
  }

  canPlaceNextRiverSegment(
    position: Position,
    gridController: GridController
  ): boolean {
    return (
      PositionUtils.isStrictOrthogonalPosition(
        position,
        this.model.lastWaterPlaced
      ) &&
      (gridController.isFireCell(position) ||
        gridController.isPositionEmpty(position)) &&
      this.model.oldRiver.filter((water) =>
        PositionUtils.isSamePosition(water, position)
      ).length == 0
    );
  }

  addSegmentToRiver(piece: WaterModel, gridController: GridController): void {
    this.model.riverPreviousPieces.push(
      gridController.getGridCellByPosition(piece.position)
    );
    this.model.river.push(piece.position);
    gridController.updateGridCell(piece);
    this.model.riverLength--;
    this.model.lastWaterPlaced = piece.position;
  }

  undoLastRiverSegment(gridController: GridController): void {
    const previousPiece = this.model.riverPreviousPieces.pop();
    if(previousPiece){
      this.model.river.pop();
      gridController.updateGridCell(previousPiece);
      this.model.riverLength++;
      const lastWaterPosition = this.model.river.at(-1)!;
      this.model.lastWaterPlaced = lastWaterPosition ? lastWaterPosition : this.model.placedWater.position;
    }
  }

  undoAllRiverSegments(gridController: GridController): void {
    while(this.model.riverPreviousPieces.length > 0){
      this.undoLastRiverSegment(gridController);
    }
  }

  restoreOldRiver(gridController: GridController): void {
    for(const waterPosition of this.model.oldRiver){
      const water = new WaterModel()
      water.position = waterPosition
      gridController.updateGridCell(water);
    }
  }

  cancelRiver(gridController: GridController): void {
    this.undoAllRiverSegments(gridController);
    this.restoreOldRiver(gridController);
    this.model.lastWaterPlaced = this.model.placedWater.position;
    this.model.oldRiver = [];
  }

  isRiverComplete(): boolean {
    return this.model.riverLength === 0;
  }

  getLastWaterPosition(): Position {
    return this.model.lastWaterPlaced;
  }

  getRemainingRiverLength(): number {
    return this.model.riverLength;
  }

  getRiver(): River {
    return this.model.river;
  }

  getPlaceWater(): WaterModel {
    return this.model.placedWater;
  }

  getOldRiver(): River {
    return this.model.oldRiver;
  }
}

export default RiverController;
