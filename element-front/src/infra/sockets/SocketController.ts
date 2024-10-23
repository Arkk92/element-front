import { PublicServerResponse } from "@/infra/schemas/server_response";
import { useAuthStore } from "@/presentation/stores/auth";
import { useRoomStore } from "@/presentation/stores/room";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  GameFound,
  ServerToClientEvents,
  UserAuthData,
} from "./socketUtils";
import { onServerError } from "./services/serverErrorSocket";
import { Emitter } from "@/main";

export class SocketController {
  constructor(
    private client: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {}
  execute() {
    const roomStore = useRoomStore();
    const authStore = useAuthStore();

    this.client.on("gameUpdate", (data: PublicServerResponse | null) => {
      // console.log(data);
      if (data) {
        roomStore.updateFromServerResponse(data);
      }
    });

    this.client.on("error", async (data) => {
      if (data != null) onServerError((data)=> {
        Emitter.emit('errorLog', data.message)
      })
    });

    this.client.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    this.client.on("userAuthData", (data: UserAuthData) => {
      if (data) {
        authStore.updateAuthData(data);
      }
    });

    this.client.on("gameFound", (data: GameFound) => {
      roomStore.setRoomId(data.roomId);
      roomStore.updateRoomState("GameFound");
    });
  }
}
