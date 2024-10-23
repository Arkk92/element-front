import { SocketInstance } from "@/main";
import { PlaceElementData } from "../../socketUtils";

// Emits an event to place an element
export function emitPlaceElement(data: PlaceElementData) {
  SocketInstance.emit("placeElement", data);
}
