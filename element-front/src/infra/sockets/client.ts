import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents, UserAuthData } from "./socketUtils";

import { useCookies } from "vue3-cookies";

class ClientSocket {

    private static URL: string = import.meta.env.VITE_BACKEND_SOCKET_PATH;

    constructor() { }

    static setupSocketConnection(): Socket<ServerToClientEvents, ClientToServerEvents> {
        
        let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
        if (this.URL == null) {
            socket = io();
        } else {
            const { cookies } = useCookies();
            let sessionData: UserAuthData | undefined 
            if(cookies){
                sessionData = {
                    roomUuid: cookies.get('roomId'),
                    userUuid: cookies.get('userId'),
                    playerUuid: cookies.get('playerId')
                }
            }
            socket = io(this.URL, {
                transports: ["websocket"],
                auth: sessionData
            }).connect()
        }
        return socket;
    }
}

export default ClientSocket;