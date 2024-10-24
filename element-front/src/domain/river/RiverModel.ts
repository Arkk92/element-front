import { River } from "@/shared/types/types";
import { WaterModel } from "../game/models/elements/water";
import { Position } from "../game/utils/position_utils";
import { IPieceModel } from "../game/models/pieces/pieces";

export type RiverPreviousPieces = Array<IPieceModel>;

export interface IRiverModel {
  oldRiver: River;
  river: River;
  riverPreviousPieces: RiverPreviousPieces;
  riverLength: number;
  lastWaterPlaced: Position;
  placedWater: WaterModel;
}

export class RiverModel implements IRiverModel {
  /** River model class */
  oldRiver: River;
  river: River;
  riverPreviousPieces: RiverPreviousPieces;
  riverLength: number;
  lastWaterPlaced: Position;
  placedWater: WaterModel;

  constructor() {
      this.placedWater = new WaterModel();
      this.oldRiver = [];
      this.river = [];
      this.riverPreviousPieces = [];
      this.riverLength = 0;
      this.lastWaterPlaced = { row: 0, column: 0 };
  }
}
