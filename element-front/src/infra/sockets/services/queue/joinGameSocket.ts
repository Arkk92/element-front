import { SocketInstance } from "@/main";
import { JoinGameData } from "../socketUtils";


// Emits an event to join a game
export function emitJoinGame(data: JoinGameData) {
    SocketInstance.emit("joinGame", data);
}