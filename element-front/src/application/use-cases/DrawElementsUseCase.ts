import { ElementTypes } from "@/domain/game/models/elements/elements";
import { emitDrawElements } from "@/infra/sockets/services/game/drawElementsSocket";
import { DrawElementsData } from "@/infra/sockets/socketUtils";

export default class DrawElementsUseCase {
  constructor() {}

  execute(elementList: Array<ElementTypes>, roomId: string): void {
    const data: DrawElementsData = {
      roomId: roomId,
      numOfElements: elementList.length,
    };
    emitDrawElements(data);
  }
}
