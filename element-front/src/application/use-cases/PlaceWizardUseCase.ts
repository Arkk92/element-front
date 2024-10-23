import { Position } from "@/domain/game/utils/position_utils";
import { emitPlaceWizard } from "@/infra/sockets/services/game/placeWizardSocket";
import { MoveSageData } from "@/infra/sockets/socketUtils";

export default class PlaceWizardUseCase {
  constructor() {}

  execute(roomId: string, position: Position, playerId: string): void {
    const data: MoveSageData = {
      roomId: roomId,
      position: position,
      playerId: playerId,
    };
    emitPlaceWizard(data);
  }
}
