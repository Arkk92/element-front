import { SocketInstance } from "@/main";
import { UsersConnectedCount } from "../socketUtils";

// Listens to socket for number of connected users
export function onNumberOfUsersConnected(callback: (data: number) => void) {
  SocketInstance.on("currentUsersConnected", (data: UsersConnectedCount) => {
    callback(data.currentUsersCount); // Send the auth data to the application layer
  });
}


