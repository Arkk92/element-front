import { SocketInstance } from "@/main";

// Listens to socket connection
export function onSocketConnect(callback: () => void) {
  SocketInstance.on("connect", () => {
    callback();
  });
}


