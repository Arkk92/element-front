import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socketUtils";

class ClientSocket {

    private static URL: string = process.env.VUE_APP_BACKEND_SOCKET_PATH;

    constructor() { }

    static setupSocketConnection(): Socket<ServerToClientEvents, ClientToServerEvents> {
        console.log(this.URL)
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