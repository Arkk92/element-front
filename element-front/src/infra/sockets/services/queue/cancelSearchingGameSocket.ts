import { SocketInstance } from "@/main";
import { Queue } from "../socketUtils";


// Emits an event to cancel searching a game
export function emitCancelSearchingGame(roomSize: Queue) {
    SocketInstance.emit("cancelQueue", roomSize);
}