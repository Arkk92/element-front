import { SocketInstance } from "@/main";
import { Queue } from "../socketUtils";


// Emits an event to start searching for a game
export function emitSearchGame(roomSize: Queue) {
    SocketInstance.emit("onQueue", roomSize);
}