import { Reaction } from "@/schemas/player_actions";
import { BoardModel, IBoardModel } from "../models/board";
import { ElementTypes } from "../models/elements/elements";
import { GameModel, GameStates, IGameModel } from "../models/game";
import { IPlayerModel } from "../models/player";
import { Position } from "../utils/position_utils";
import BoardController from "./board_controller";
import PlayerController from "./player_controller";
import { TurnController } from "./turn_controller";


export interface IGameController {
    addPlayer(player: IPlayerModel): void;
    setupGame(game_type: number): void;
    drawingElements(elements: Array<ElementTypes>): void;
    placeElement(element: ElementTypes, position: Position, reaction?: Reaction): void;
    movePlayerSage(player: string, position: Position): void;
    endOfPlayerTurn(): void;
    getBoard(): IBoardModel;
    getTurnPlayer(): IPlayerModel;
    getGameState(): GameStates;
    getWinner(): number | null;
}

export class GameController implements IGameController {

    private model: GameModel;

    constructor(model: IGameModel) {
        this.model = model;
    }

    public addPlayer(player: IPlayerModel): void {
        this.model.player_list.push(player);
    }

    public setupGame(game_type: number): void {
        // Resets the board

        this.model.board = new BoardModel();
        const board_controller: BoardController = new BoardController(this.model.board);
        board_controller.initBoard();

        this.model.player_list.forEach((player) => {
            board_controller.createSageByPlayerAndGameType(player, game_type);
        })
        this.model.game_type = game_type;
        this.model.state = GameStates.GameRunning;
    }

    public drawingElements(elements: Array<ElementTypes>): void {

        const turn_controller: TurnController = new TurnController(this.model.turn);
        const board_controller: BoardController = new BoardController(this.model.board);

        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Cannot draw elements if the game hadn't started or has ended");
        }
        if (turn_controller.isDrawingElementsAllowed() == false) {
            throw new Error("Drawing elements is only allowed at the start of the turn")
        }
        if (turn_controller.isNumberOfDrawnElementsAllowed(elements.length) == false) {
            throw new Error("Maximum number of allowed elements to be requested have been exceded")
        }
        if (board_controller.checkElementPoolAvailability(elements) == false) {
            throw new Error("Requested elements cannot be taken from the pool");
        }
        for (let element of elements) {
            board_controller.getElementFromPool(element);
        }
        turn_controller.setDrawnElements(elements);
    }

    public placeElement(element: ElementTypes, position: Position, reaction?: Reaction): void {

        const turn_controller: TurnController = new TurnController(this.model.turn);
        const board_controller: BoardController = new BoardController(this.model.board);

        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Placing element is not allowed in the current game state");
        }

        if (turn_controller.isPlaceElementAllowed() == false) {
            throw new Error("No more available elements to be placed");
        }

        if (turn_controller.removeElementFromList(element) == false) {
            throw new Error("The element is not from the Drawn elements");
        }
        board_controller.placeElement(element, position);
        board_controller.performElementReaction(element, position, reaction);

        const loser: string = board_controller.winningCondition(position);

        if (loser !== "") {
            this.model.loser_uuid = loser;
        }

        if (turn_controller.isEndOfTurn()) {
            this.nextPlayerTurn();
        }
    }

    private nextPlayerTurn(): void {
        const turn_controller: TurnController = new TurnController(this.model.turn);

        let player_number: number = turn_controller.getPlayer() + 1
        if (player_number == this.model.game_type) {
            player_number = 0;
        }
        turn_controller.changeTurn(player_number);
    }

    public movePlayerSage(player_id: string, position: Position): void {

        const turn_controller: TurnController = new TurnController(this.model.turn);
        const board_controller: BoardController = new BoardController(this.model.board);

        if (this.model.state != GameStates.GameRunning) {
            throw new Error("Moving sage is not allowed in the current game state");
        }
        if (turn_controller.isMovingSageAllowed() == false) {
            throw new Error("Cannot move sage, not available moves to spend");
        }
        
        try {
            board_controller.placePlayerSage(this.getPlayerById(player_id), position);
            turn_controller.decreaseSageMoves();
        }
        catch (error){
            throw error;
        }

        if (turn_controller.isEndOfTurn()) {
            this.nextPlayerTurn();
        }
    }

    public endOfPlayerTurn(): void {

        const board_controller: BoardController = new BoardController(this.model.board);
        const turn_controller: TurnController = new TurnController(this.model.turn);

        const remaining_elements: Array<ElementTypes> = turn_controller.getRemainingElements();

        for (let element of remaining_elements) {
            board_controller.returnElementToPool(element);
        }
        this.nextPlayerTurn();
    }

    public getBoard(): IBoardModel {
        return this.model.board;
    }

    public getTurnPlayer(): IPlayerModel {
        const turn_controller: TurnController = new TurnController(this.model.turn);
        return this.model.player_list[turn_controller.getPlayer()];
    }

    public getGameState(): GameStates {
        return this.model.state;
    }

    public getWinner(): number | null {
        if (this.model.loser_uuid != "") {
            for (let player of this.model.player_list) {
                const player_controller: PlayerController = new PlayerController(player)
                if (player_controller.getSage().uuid === this.model.loser_uuid) {
                    return player_controller.getPlayerNumber();
                }
            }
        }
        return null;

    }

    /**
    * loadGame
    */
    public async loadGame(game: IGameModel): Promise<void> {
        this.model = game;

    }

    /**
     * getPlayerById
     */
    public getPlayerById(player_id: string): IPlayerModel {
        for (let player of this.model.player_list) {
            if (player.uuid === player_id) {
                return player;
            }
        }
        throw new Error("Player Id not found");
    }

    /**
     * Force loser (e.g when someone disconnect)
     * @param player_id 
     */
    public forceLoser(player_id: string) {
        this.model.loser_uuid = player_id;
    }
}