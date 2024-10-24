import { SocketInstance } from "@/main";

// Listens to socket connection errors
export function onSocketConnectError(callback: (err: any) => void) {
  SocketInstance.on("connect_error", (err) => {
    console.log(err)
    // callback(err); // Send the auth data to the application layer
  });
}


