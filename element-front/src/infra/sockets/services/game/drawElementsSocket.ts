import { SocketInstance } from "@/main";
import { DrawElementsData } from "../../socketUtils";

// Emits an event to move the wizard
export function emitDrawElements(data: DrawElementsData) {
  SocketInstance.emit("drawElements", data);
}
