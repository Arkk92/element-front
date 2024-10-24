import { PrivateServerResponse } from "@/infra/schemas/server_response";
import { Emitter, SocketInstance } from "@/main";

// Listens to 'gameUpdate' event from the server
export function onServerError(callback: (data: PrivateServerResponse) => void) {
  SocketInstance.on("error", async (data) => {
    if(data){
      callback(data); // Send the data to the application layer
    }
  });
}
