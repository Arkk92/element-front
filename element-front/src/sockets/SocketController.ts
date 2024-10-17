import { PublicServerResponse } from "@/schemas/server_response";
import { useAuthStore } from "@/stores/auth";
import { useRoomStore } from "@/stores/room";
import { Socket } from "socket.io-client";
import ServerErrorHandlerService from "./services/SeverErrorHandler";
import {
  ClientToServerEvents,
  GameFound,
  ServerToClientEvents,
  UserAuthData,
} from "./socketUtils";

export class SocketController {
  constructor(
    private client: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {}
  execute() {
    const roomStore = useRoomStore();
    const authStore = useAuthStore();

    this.client.on("gameUpdate", (data: PublicServerResponse | null) => {
      console.log(data);
      if (data) {
        roomStore.updateFromServerResponse(data);
      }
    });

    this.client.on("error", async (data) => {
      const serverErrorHandlerService = new ServerErrorHandlerService();
      if (data != null) serverErrorHandlerService.execute(data);
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

    console.log("Event Listeners Ready!")
  }
}
