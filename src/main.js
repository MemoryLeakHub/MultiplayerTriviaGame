import {
  getRandomItemFromArray, removeItem
} from './utils';

const GameStatus = Object.freeze({
  PrepGame: 'PrepGame',
  InGame: 'InGame',
});
const GamePhase = Object.freeze({
  PickStartingTile: 'PickStartingTile',
  PickEmptyTile: 'PickEmptyTile',
});
const PlayerStatus = Object.freeze({
  Login: 'Login',
  Lobby: 'Lobby',
  InGame: 'InGame',
});

const TileStatus = Object.freeze({
  Empty: 'Empty',
  Taken: 'Taken',
  ReTaken: 'ReTaken',
});

const InGameMoveStatus = Object.freeze({
  PickStartingTileEnd: 'PickStartingTileEnd'
});
const CHOOSE_STARTING_POSITION_TIMEOUT = 2000; 
// playerIdToPlayerState[id] = playerState 
// -- status -> Status

function onRoomStart(roomState) {
  const { logger } = roomState;
  logger.info('Start called')
  logger.warn('TODO: implement what the state of the room looks like initially')
  return {
    state: {
      status: GameStatus.PrepGame,
      gamePhase: GamePhase.PickStartingTile,
      phaseTimerStart: {},
      phaseTimerTotal: {},
      playerIdToPlayerState: {},
      mapConnectedSections: [
        {//1
          connected: [2,3],
          status: TileStatus.Empty
        },
        {//2
          connected: [1,3,4,5],
          status: TileStatus.Empty
        },
        {//3
          connected: [1,2,4],
          status: TileStatus.ReTaken
        },
        {//4
          connected: [2,3,5,6],
          status: TileStatus.Empty
        },
        {//5
          connected: [2,4,6,7,8,9],
          status: TileStatus.Empty
        },
        {//6
          connected: [4,5,7],
          status: TileStatus.Empty
        },
        {//7
          connected: [5,6,8,11,12],
          status: TileStatus.Empty
        },
        {//8
          connected: [5,7,9,10,11],
          status: TileStatus.Empty
        },
        {//9
          connected: [5,8,10,13],
          status: TileStatus.Empty
        },
        {//10
          connected: [8,9,11,13,14],
          status: TileStatus.Empty
        },
        {//11
          connected: [7,8,10,12,14],
          status: TileStatus.Empty
        },
        {//12
          connected: [7,11],
          status: TileStatus.Empty
        },
        {//13
          connected: [9,14],
          status: TileStatus.Empty
        },
        {//14
          connected: [10,11,13],
          status: TileStatus.Empty
        },
      ],
       emptyMapSections: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],

    }
  }
}

function onPlayerJoin(player, roomState) {
  const { state, logger } = roomState
  logger.info('Join called with:', { player, state })
  logger.warn('TODO: implement how to change the roomState when a player joins')

  const playerState = state.playerIdToPlayerState[player.id]
  if (playerState === undefined) {
    state.playerIdToPlayerState[player.id] = {
      status: PlayerStatus.Login,
      isBot: false,
      isMaster: false,
      mapSections: [],
      battleForTile: []
    }
  }
  logger.warn('TODO: 2222')

  return { state }
}

function onPlayerQuit(player, roomState) {
  const { logger } = roomState
  logger.info('Quit called with:', { player, roomState })
  logger.warn('TODO: implement how to change the roomState when a player quits the room')
  return {}
}

function onPlayerMove(player, move, roomState) {
  const { state, logger } = roomState;
  logger.info('Move called with:', { player, move, state })
  logger.warn('TODO: implement how to change the roomState when any player makes a move')

  const status = state.status;
  const playerState = state.playerIdToPlayerState[player.id]

  switch (status) {
    case GameStatus.PrepGame:
      if (playerState.status === PlayerStatus.Login) {
        return onLoginMove(player, move, roomState);
      } else if (playerState.status === PlayerStatus.Lobby){ 
        return onLobbyMove(player, move, roomState);
      }
    case GameStatus.InGame:
      logger.info('sssss 6')
      return onInGameMove(player, move, roomState);
    default:
      throw new Error("Game got corrupted, with invalid 'roomState.state.status'. This should never happen, so contact developers.");
  }
}

function onLoginMove(player, move, roomState) {
  const { state, players, logger } = roomState;

  const { username } = move
  
  const playerState = state.playerIdToPlayerState[player.id]
  playerState.status = PlayerStatus.Lobby
  playerState.username = username
  playerState.isMaster = true

  state.playerIdToPlayerState["bot_1"] = {
    status: PlayerStatus.Lobby,
    isBot: true,
    isMaster: false,
    mapSections: [],
    battleForTile: []
  }
  state.playerIdToPlayerState["bot_1"].username = "John"
  state.playerIdToPlayerState["bot_2"] = {
    status: PlayerStatus.Lobby,
    isBot: true,
    isMaster: false,
    mapSections: [],
    battleForTile: []
  }
  state.playerIdToPlayerState["bot_2"].username = "Tom"

  logger.warn('TODO: 444')
  return { state };
}
function onLobbyMove(player, move, roomState) {
  const { state, players, logger } = roomState;

  if (move) {
    players.map((player) => { 
      player.status = PlayerStatus.InGame
    })
    
    state.status = GameStatus.InGame
    state.gamePhase = GamePhase.PickStartingTile
    state.phaseTimerStart = new Date().getTime();
    state.phaseTimerTotal = CHOOSE_STARTING_POSITION_TIMEOUT
    
    chooseTileAndRemove(state, state.playerIdToPlayerState["bot_1"])
    chooseTileAndRemove(state, state.playerIdToPlayerState["bot_2"])
  
  }
  
  return { state };
}

function chooseTileAndRemove(state, entity) { 
  var randomAvailableTile = getRandomItemFromArray(state.emptyMapSections)
  removeItem(state.emptyMapSections, state.emptyMapSections[randomAvailableTile])
  entity.mapSections.push(randomAvailableTile)
}
function chooseTileWithBotEmpty(state, bot) { 
  var randomElements = getRandomNElementsFromArray(state.emptyMapSections)
  bot.battleForTile = randomElements
}
function checkIfAllPlayersHaveSelectedTiles(roomState) { 
  const { state, players, logger } = roomState;
  Object.entries(state.playerIdToPlayerState).map(([k, player]) => { 
    logger.info('player:',  player )
    if (player.mapSections.length == 0) {
      chooseTileAndRemove(state, player)
    } 
  })
}
function onInGameMove(player, move, roomState) {
  const { state, players, logger } = roomState;
  logger.info('onInGameMovey called with:', { player, move, state })

  const { InGameMoveStatusFront } = move
  if (InGameMoveStatus.PickStartingTileEnd === InGameMoveStatusFront) {

    checkIfAllPlayersHaveSelectedTiles(roomState)
    state.gamePhase = GamePhase.PickEmptyTile
    chooseTileWithBotEmpty(state, state.playerIdToPlayerState["bot_1"])
    chooseTileWithBotEmpty(state, state.playerIdToPlayerState["bot_2"])
  }

  return { state };
}


// Export these functions so UrTurn runner can run these functions whenever the associated event
// is triggered. Follow an example flow of events: https://docs.urturn.app/docs/Introduction/Flow-Of-Simple-Game
export default {
  onRoomStart,
  onPlayerJoin,
  onPlayerQuit,
  onPlayerMove,
};
