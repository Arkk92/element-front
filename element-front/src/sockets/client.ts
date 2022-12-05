import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socketUtils";

class ClientSocket {

    private static URL: string = "ws://localhost:3000";

    constructor() { }

    static setupSocketConnection(): Socket<ServerToClientEvents, ClientToServerEvents> {
        let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
        if (this.URL == null) {
            socket = io();
        } else {
            socket = io(this.URL, {
                transports: ["websocket"]
            }).connect()
        }
        return socket;
    }
}

export default ClientSocket;