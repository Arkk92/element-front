import { io, Socket } from "socket.io-client";
import {
    ClientToServerEvents,
    ServerToClientEvents,
    UserAuthData,
} from "./socketUtils";


class ClientSocket {

  private static URL: string = import.meta.env.VITE_BACKEND_SOCKET_PATH;

  constructor() { }

  static setupSocketConnection(sessionData?: UserAuthData): Socket<ServerToClientEvents, ClientToServerEvents> {
      
      let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
      if (this.URL == null) {
          socket = io();
      } else {
          socket = io(this.URL, {
              transports: ["websocket"],
              auth: sessionData
          }).connect()
      }
      return socket;
  }
}

export default ClientSocket;
