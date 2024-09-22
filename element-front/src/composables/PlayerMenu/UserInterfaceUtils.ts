import {
  ElementPoolManagerModel,
  ElementPoolModel,
} from "@/game/models/element_pool";
import { ElementTypes } from "@/game/models/elements/elements";
import { SocketInstance } from "@/main";
import { DrawElements, EndTurn } from "@/sockets/socketUtils";

class UserInterfaceUtils {
  static MAX_ALLOWED_ELEMENTS: number = 3;
  static MIN_SAGE_MOVEMENTS: number = 2;

  static countElementsDrawn(
    elementList: Array<ElementTypes>,
    element: ElementTypes
  ): number {
    return elementList.filter((el) => el == (element as ElementTypes)).length;
  }

  static addElementToList(
    elementList: Array<ElementTypes>,
    elementPoolManager: ElementPoolManagerModel,
    element: ElementTypes
  ): Array<ElementTypes> {
    const requested: number = this.countElementsDrawn(elementList, element);
    if (
      elementList.length < this.MAX_ALLOWED_ELEMENTS &&
      elementPoolManager !== null
    ) {
      let poolModel: ElementPoolModel;
      switch (element) {
        case ElementTypes.Fire:
          poolModel = elementPoolManager.fire;
          break;
        case ElementTypes.Water:
          poolModel = elementPoolManager.water;
          break;
        case ElementTypes.Wind:
          poolModel = elementPoolManager.wind;
          break;
        case ElementTypes.Earth:
          poolModel = elementPoolManager.earth;
          break;
      }
      if (poolModel.amount - requested - 1 >= 0) {
        elementList.push(element as ElementTypes);
      }
    }
    return elementList;
  }
  static removeElementFromList(
    elementList: Array<ElementTypes>,
    element: ElementTypes
  ): Array<ElementTypes> {
    const requested: number = this.countElementsDrawn(elementList, element);
    if (requested > 0) {
      elementList.splice(elementList.indexOf(element as ElementTypes), 1);
    }
    return elementList;
  }

  static drawElements(elementList: Array<ElementTypes>, roomId: string): void {
    const data: DrawElements = {
      roomId: roomId,
      numOfElements: elementList.length,
    };
    SocketInstance.emit("drawElements", data);
  }

  static endTurn(roomId: string){
    const data: EndTurn = {
      roomId: roomId!
    }
    SocketInstance.emit('endTurn', data);
  }
}

export default UserInterfaceUtils;
