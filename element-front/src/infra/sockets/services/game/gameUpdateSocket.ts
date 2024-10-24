import { PublicServerResponse } from '@/infra/schemas/server_response';
import { SocketInstance } from '@/main';


// Listens to 'gameUpdate' event from the server
export function onGameUpdated(callback: (data: PublicServerResponse | null) => void) {
    SocketInstance.on('gameUpdate', (data) => {
      if(data){
        callback(data); // Send the data to the application layer
      }
  });
}

// Emits an event to update the game
export function emitGameUpdateRequest() {
    SocketInstance.emit('forceGameUpdate');
}