import { ClickedData } from "@/components/PlayerMenu/types";
import { ElementTypes } from "@/game/models/elements/elements";
import { TurnModel } from "@/game/models/turn";
import { Position } from "@/game/utils/position_utils";
import { Emitter, SocketInstance } from "@/main";
import { WaterReaction } from "@/schemas/player_actions";
import { MoveSage, PlaceElement } from "@/sockets/socketUtils";

class PlacementUtils {
  static placeElement(
    roomId: string,
    element: ElementTypes,
    clickedData: ClickedData
  ) {
    const data: PlaceElement = {
      roomId: roomId,
      element: element,
      position: (clickedData as ClickedData).piece.position,
    };
    if (
      (clickedData as ClickedData).oldRiver != null &&
      (clickedData as ClickedData).newRiver != null
    ) {
      const waterReaction: WaterReaction = new WaterReaction(
        (clickedData as ClickedData).oldRiver!,
        (clickedData as ClickedData).newRiver!
      );
      data.reaction = waterReaction;
    }
    SocketInstance.emit("placeElement", data);
  }

  static placeSage(
    turn: TurnModel,
    player: String,
    position: Position,
    roomId: string
  ) {
    if (turn.available_sage_moves > 0) {
      const data: MoveSage = {
        roomId: roomId,
        position: position as Position,
        playerId: player as string,
      };
      SocketInstance.emit("moveSage", data);
    } else {
      Emitter.emit('errorLog', 'No more moves available.')
    }
  }
}

export default PlacementUtils;
