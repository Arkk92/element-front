import { SocketInstance } from "@/main";
import { UserAuthData } from "./socketUtils";

// Listens to 'userAuthData' event from the server
export function onUserAuthDataUpdated(callback: (data: UserAuthData) => void) {
  SocketInstance.on("userAuthData", (data: UserAuthData) => {
    callback(data); // Send the auth data to the application layer
  });
}
