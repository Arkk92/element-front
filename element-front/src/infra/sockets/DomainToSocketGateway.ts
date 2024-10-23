import { Emitter } from "@/main";
import { useRoomStore } from "@/presentation/stores/room";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  JoinGameData,
  ServerToClientEvents,
} from "./socketUtils";

/* Class in charge of gatewaying domain events to socket */
export class DomainToSocketGateway {
  constructor(
    private client: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {}
  execute() {
    Emitter.on("GameAccepted", () => {
      const roomStore = useRoomStore();
      const data: JoinGameData = {
        roomId: roomStore.getRoomId,
        username: roomStore.username,
      };
      this.client.emit("joinGame", data);
    });

    Emitter.on("CancelGameSearching", () => {
      const roomStore = useRoomStore();
      this.client.emit("cancelQueue", roomStore.roomSize);
    });

    Emitter.on("SearchingGame", () => {
      const roomStore = useRoomStore();
      this.client.emit("onQueue", roomStore.roomSize);
    });

    Emitter.on("ReJoiningGame", () => {
      this.client.emit("forceGameUpdate");
    });
  }
}
