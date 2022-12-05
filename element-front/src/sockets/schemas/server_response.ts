import { IRoomModel } from '@/game/models/room';

export enum PrivateServerResponseStatus {
    ERROR = "ERROR",
    OK = "OK"
}

type MessageHeader = {
    room_uuid: string;
}

export type PrivateServerResponse = MessageHeader & {
    status: PrivateServerResponseStatus;
    message: string | null;
    room?: IRoomModel;
}

export type PublicServerResponse = MessageHeader & {
    room: IRoomModel;
    winner?: number | null;
    player_turn_uuid: string;
}