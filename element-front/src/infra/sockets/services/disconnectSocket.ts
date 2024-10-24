import { SocketInstance } from "@/main";

// Listens to socket disconnection
export function onSocketDisconnect(callback: () => void) {
  SocketInstance.on("disconnect", () => {
    callback();
  });
}


