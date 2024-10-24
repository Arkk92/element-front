import { ElementTypes } from "@/domain/game/models/elements/elements";
import { PieceModel } from "@/domain/game/models/pieces/pieces";
import { WaterReaction } from "@/infra/schemas/player_actions";
import { emitPlaceElement } from "@/infra/sockets/services/game/placeElementSocket";
import { PlaceElementData } from "@/infra/sockets/socketUtils";
import { RiverData } from "@/shared/types/types";

export default class PlaceRiverUseCase {
  constructor() {}

  execute(roomId: string, piece: PieceModel, riverData: RiverData): void {
    const data: PlaceElementData = {
      roomId: roomId,
      element: ElementTypes.Water,
      position: piece.position,
    };
    if (
      riverData.oldRiver != null &&
      riverData.newRiver != null
    ) {
      const waterReaction: WaterReaction = new WaterReaction(
        riverData.oldRiver!,
        riverData.newRiver!
      );
      data.reaction = waterReaction;
    } else {
      throw new Error('River data cannot be null');
    }
    emitPlaceElement(data);
  }
}
