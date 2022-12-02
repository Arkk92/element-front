import { ElementTypes } from "@/game/models/elements/elements";
import { io, Socket } from "socket.io-client";

export enum QueueTypes {
    queue2 = 'queue2',
    queue3 = 'queue3',
    queue4 = 'queue4'
}

export type JoinQueue = {
    queue: QueueTypes
}
export type JoinGame = {
    roomId: string
}

export type DrawElements = {
    roomId: string
    elements: Array<ElementTypes>
}



export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: number) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    gameUpdate: (data: any) => void;
    gameFound: (roomId: string) => void;
}

export interface ClientToServerEvents {
    forceGameUpdate: (roomId: string) => void;
    joinRoom: (a: string) => void;
    movePlayerSage: (player: number, row: string, column: string) => void;
    onQueue: (data: JoinQueue) => void;
    joinGame: (data: JoinGame) => void;
    drawElements: (data: DrawElements) => void;
}

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