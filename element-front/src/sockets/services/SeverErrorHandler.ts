import { Emitter } from "@/main";
import { PrivateServerResponse } from "@/schemas/server_response";

export default class ServerErrorHandlerService {

    constructor(){

    }
    execute(data: PrivateServerResponse){
        Emitter.emit('errorLog', data.message)
        Emitter.emit('resetPlayerMenu');
    }
}