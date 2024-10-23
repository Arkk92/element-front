import { RoomModel, RoomModelMap } from "@/domain/game/models/room";

export default class GameUpdateUseCase {
    constructor(private roomModelMap: RoomModelMap){}

    execute(gameUpdateData: any): RoomModel {
        const roomModel = this.roomModelMap.toDomain(gameUpdateData.room);
        return roomModel;
    }
}