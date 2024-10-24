import { SocketInstance } from "@/main";
import { MoveSageData } from "../../socketUtils";


// Emits an event to move the wizard
export function emitPlaceWizard(data: MoveSageData) {
  SocketInstance.emit("moveSage", data);
}
