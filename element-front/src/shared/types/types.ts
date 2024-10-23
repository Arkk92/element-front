import { Position } from "@/domain/game/utils/position_utils";


export type River = Array<Position>;

export type RiverData = {
  oldRiver?: River;
  newRiver?: River;
};
