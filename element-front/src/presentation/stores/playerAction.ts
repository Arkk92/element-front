import DrawElementsUseCase from "@/application/use-cases/DrawElementsUseCase";
import EndTurnUseCase from "@/application/use-cases/EndTurnUseCase";
import { ElementPoolModel } from "@/domain/game/models/element_pool";
import { EarthModel } from "@/domain/game/models/elements/earth";
import { ElementTypes } from "@/domain/game/models/elements/elements";
import { FireModel } from "@/domain/game/models/elements/fire";
import { WaterModel } from "@/domain/game/models/elements/water";
import { WindModel } from "@/domain/game/models/elements/wind";
import { Position } from "@/domain/game/utils/position_utils";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useRoomStore } from "./room";

type ElementModels = FireModel | WaterModel | WindModel | EarthModel | null;
const defaultState = {
  wizardPosition: null as null | Position,
  elementSelected: null as ElementModels,
  elementSelectedIndex: null as null | number,
  elementList: [] as Array<ElementTypes>,
};
const MAX_ALLOWED_ELEMENTS: number = 3;
const MIN_SAGE_MOVEMENTS: number = 2;
const endTurnUseCase = new EndTurnUseCase();
const drawElementsUseCase = new DrawElementsUseCase();

export const usePlayerActionStore = defineStore("playerAction", {
  state: () => {
    return { ...defaultState };
  },
  getters: {
    numAvailableElementsToDraw(): number {
      return MAX_ALLOWED_ELEMENTS - this.elementList.length;
    },
    numAvailableWizardMoves(): number {
      return MIN_SAGE_MOVEMENTS + this.numAvailableElementsToDraw;
    },
  },
  actions: {
    reset() {
      Object.assign(this, defaultState);
    },
    selectWizard(position: Position) {
      this.wizardPosition = position;
    },
    unselectWizard() {
      this.wizardPosition = null;
    },
    isWizardSelected() {
      return this.wizardPosition !== null;
    },
    selectElement(elementIndex: number) {
      const element = this.elementList[elementIndex];
      const elementToModelMap: { [key in ElementTypes]: any } = {
        [ElementTypes.Earth]: EarthModel,
        [ElementTypes.Fire]: FireModel,
        [ElementTypes.Water]: WaterModel,
        [ElementTypes.Wind]: WindModel,
      };
      this.elementSelectedIndex = elementIndex;
      this.elementSelected = new elementToModelMap[element]();
    },
    unselectElement() {
      this.elementSelectedIndex = null;
      this.elementSelected = null;
    },
    isElementSelected() {
      return this.elementSelected !== null;
    },
    endTurn() {
      const authStore = useAuthStore();
      endTurnUseCase.execute(authStore.roomId);
    },
    drawElements() {
      const authStore = useAuthStore();
      drawElementsUseCase.execute(this.elementList, authStore.roomId);
    },
    countElementsDrawn(element: ElementTypes): number {
      return this.elementList.filter((el) => el == (element as ElementTypes))
        .length;
    },

    addElementToList(element: ElementTypes = ElementTypes.Fire) {
      const roomStore = useRoomStore();
      const requested: number = this.countElementsDrawn(element);
      const elementPoolManager = roomStore.model.game.board.elementPool;
      const elementToPoolMap: { [key in ElementTypes]: ElementPoolModel } = {
        [ElementTypes.Earth]: elementPoolManager.earth,
        [ElementTypes.Fire]: elementPoolManager.fire,
        [ElementTypes.Water]: elementPoolManager.water,
        [ElementTypes.Wind]: elementPoolManager.wind,
      };
      if (
        this.elementList.length < MAX_ALLOWED_ELEMENTS &&
        elementPoolManager !== null
      ) {
        const poolModel: ElementPoolModel = elementToPoolMap[element];
        if (poolModel.amount - requested - 1 >= 0) {
          this.elementList.push(element as ElementTypes);
        }
      }
    },
    removeElementFromList(element: ElementTypes = ElementTypes.Fire) {
      const requested: number = this.countElementsDrawn(element);
      if (requested > 0) {
        this.elementList.splice(
          this.elementList.indexOf(element as ElementTypes),
          1
        );
      }
    },
  },
});
