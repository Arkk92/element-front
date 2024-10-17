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
    this.client.on("gameUpdate", (data: PublicServerResponse | null) => {
      const roomStore = useRoomStore();
      const authStore = useAuthStore();
      console.log(data)
      if (data){
        if(authStore.playerId === null) {
          const userToPlayerMap = data.room.user_to_player_map
          const playerId: string = userToPlayerMap.filter(map => map.user_uuid === authStore.userId)[0].player_uuid;
          authStore.setPlayerId(playerId);
        }
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
      const authStore = useAuthStore();
      if (data) authStore.updateAuthData(data);
    });

    this.client.on("gameFound", (data: GameFound) => {
      const roomStore = useRoomStore();
      roomStore.setRoomId(data.roomId);
      roomStore.updateRoomState("GameFound");
    });
  }
}
