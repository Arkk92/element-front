import { SocketInstance } from "@/main";
import { EndTurnData } from "../../socketUtils";

// Emits an event to move the wizard
export function emitEndTurn(data: EndTurnData) {
  SocketInstance.emit("endTurn", data);
}
