import { ElementTypes } from "@/domain/game/models/elements/elements";
import { Position } from "@/domain/game/utils/position_utils";
import { emitPlaceElement } from "@/infra/sockets/services/game/placeElementSocket";
import { PlaceElementData } from "@/infra/sockets/socketUtils";

export default class PlaceElementUseCase {
  constructor() {}

  execute(roomId: string, element: ElementTypes, position: Position): void {
    const data: PlaceElementData = {
      roomId: roomId,
      element: element,
      position: position,
    };
    emitPlaceElement(data);
  }
}
