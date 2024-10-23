import { emitEndTurn } from "@/infra/sockets/services/game/endTurnSocket";
import { EndTurnData } from "@/infra/sockets/socketUtils";

export default class EndTurnUseCase {
  constructor() {}

  execute(roomId: string) {
    const data: EndTurnData = {
      roomId: roomId!,
    };
    emitEndTurn(data);
  }
}
