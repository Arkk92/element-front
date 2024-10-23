import { SocketInstance } from "@/main";
import { GameFound } from "../../socketUtils";

// Listens to 'gameFound' event from the server
export function onGameFound(callback: (data: GameFound) => void) {
  SocketInstance.on("gameFound", (data: GameFound) => {
    callback(data); // Send the data to the application layer
  });
}
