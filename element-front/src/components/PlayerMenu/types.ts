import { ElementTypes } from "@/game/models/elements/elements";
import { PieceModel } from "@/game/models/pieces/pieces";
import { Position } from "@/game/utils/position_utils";

// eslint-disable-next-line
export enum NoneElement {
  // eslint-disable-next-line
  None = "None",
}
export type Elements = ElementTypes | NoneElement;

export type River = Array<Position>;

export type ClickedData = {
  piece: PieceModel;
  oldRiver?: River;
  newRiver?: River;
};
