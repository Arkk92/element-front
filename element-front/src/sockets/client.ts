import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: number) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    gameUpdate: (room: any) => any;
}

export interface ClientToServerEvents {
    forceGameUpdate: () => void;
    joinRoom: (a: string) => void;
    movePlayerSage: (player: number, row: string, column: string) => void;
}

class ClientSocket {

    private static URL: string = "ws://localhost:3000";

    constructor(){}

    static setupSocketConnection():  Socket<ServerToClientEvents, ClientToServerEvents> {
        let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
        if(this.URL == null){
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