import {
  getRandomItemFromArray, removeItem, getRandomNElementsFromArray, randomIntFromInterval
} from './utils';
import {
  QUESTIONS_NUMBERS, QUESTIONS_PICK
} from './questions';
const PlayerType = Object.freeze({
  RED: 0,
  BLUE: 1,
  GREEN: 2
});

const GameStatus = Object.freeze({
  PrepGame: 'PrepGame',
  InGame: 'InGame',
});
const GamePhase = Object.freeze({
  PickStartingTile: 'PickStartingTile',

  PickEmptyTile: 'PickEmptyTile',
  EmptyTileBattle: 'EmptyTileBattle',
  ShowEmptyTileBattleAnswers: 'ShowEmptyTileBattleAnswers',

  PickTileToAttack: 'PickTileToAttack',
  PickTileToAttackBattle: 'PickTileToAttackBattle',
  ShowAnswersPickTileToAttackBattle: 'ShowAnswersPickTileToAttackBattle',

  EndGame: 'EndGame',
});

const InGameMoveStatus = Object.freeze({
  PickStartingTileEnd: 'PickStartingTileEnd',

  PickEmptyTileEnd: 'PickEmptyTileEnd',
  EmptyTileBattleEnd: 'EmptyTileBattleEnd',
  ShowEmptyTileBattleAnswersEnd: 'ShowEmptyTileBattleAnswersEnd',

  PickTileToAttackEnd: 'PickTileToAttackEnd',
  PickTileToAttackBattleEnd: 'PickTileToAttackBattleEnd',
  ShowAnswersPickTileToAttackBattleEnd: 'ShowAnswersPickTileToAttackBattleEnd'

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
const PlayerAction = Object.freeze({
  PickTilePlayerAction: 'PickTilePlayerAction',
  PickAnswerPlayerAction: 'PickAnswerPlayerAction',
  PickTileToAttackPlayerAction: 'PickTileToAttackPlayerAction',
  PickTileToAttackBattleAnswerPlayerAction: 'PickTileToAttackBattleAnswerPlayerAction'
});
const CHOOSE_STARTING_POSITION_TIMEOUT = 8000; 

const CHOOSE_EMPTY_TILE_TIMEOUT = 8000; 
const BATTLE_EMPTY_TILE_TIMEOUT = 14000; 
const BATTLE_EMPTY_TILE_SHOW_ANSWERS_TIMEOUT = 4000; 

const CHOOSE_TILE_TO_ATTACK_TIMEOUT = 8000; 
const ATTACK_BATTLE_TIMEOUT = 14000; 
const ATTACK_BATTLE_SHOW_ANSWERS_TIMEOUT = 4000; 

// playerIdToPlayerState[id] = playerState 
// -- status -> Status


function onRoomStart(roomState) {
  const { logger } = roomState;
 // logger.info('Start called')
  logger.warn('TODO: implement what the state of the room looks like initially')

  const colors = [PlayerType.BLUE, PlayerType.RED, PlayerType.GREEN]
  const shuffledColors = colors.sort((a, b) => 0.5 - Math.random());

  
  let state =  {
    status: GameStatus.PrepGame,
    gamePhase: GamePhase.PickStartingTile,
    numberOfPlayers: 0,
    phaseTimerStart: {},
    phaseTimerTotal: {},
    botTimeRange: [2000,BATTLE_EMPTY_TILE_TIMEOUT],
    botDifficulty: 20,
    playerColors: shuffledColors,
    answerPlacements: [],
    playerIdToPlayerState: {},
    question: QUESTIONS_PICK[0],
    tileAttackRound: 0,
    tileAttackOrder: [
      PlayerType.RED, PlayerType.BLUE, PlayerType.GREEN,
      PlayerType.BLUE, PlayerType.RED, PlayerType.GREEN,
      PlayerType.RED, PlayerType.GREEN, PlayerType.BLUE,
      PlayerType.GREEN, PlayerType.RED, PlayerType.BLUE,
    ],
    tileAttackDefender: null,
    tileAttackDefenderTile: null,
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
        status: TileStatus.Empty
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
  state.playerIdToPlayerState["bot_1"] = {
    status: PlayerStatus.Lobby,
    isBot: true,
    isMaster: false,
    mapSections: [],
    battleForTile: [],
    tatalValue: 0,
    answer:null,
    type: state.playerColors[1],
  }
  state.playerIdToPlayerState["bot_1"].username = "John"

  state.playerIdToPlayerState["bot_2"] = {
    status: PlayerStatus.Lobby,
    isBot: true,
    isMaster: false,
    mapSections: [],
    battleForTile: [],
    answer:null,
    tatalValue: 0,
    type: state.playerColors[2]
  }
  state.playerIdToPlayerState["bot_2"].username = "Tom"
  return { state }
}
// 0 - red,1 - blue,2 - green
function onPlayerJoin(player, roomState) {
  const { state, logger } = roomState
  //logger.warn('TODO: implement how to change the roomState when a player joins')

  const playerState = state.playerIdToPlayerState[player.id]
  if (playerState == undefined) {
    state.playerIdToPlayerState[player.id] = {
      status: PlayerStatus.Login,
      type: state.playerColors[state.numberOfPlayers],
      isBot: false,
      isMaster: (state.numberOfPlayers == 0),
      madePhaseAction: false,
      timeAnswered: 0,
      tatalValue: 0,
      answer:null,
      mapSections: [],
      battleForTile: []
    }
    state.numberOfPlayers++;
  }
  
  if (state.numberOfPlayers == 2) {
    delete state.playerIdToPlayerState["bot_1"]
  } else if (state.numberOfPlayers == 3) { 
    delete state.playerIdToPlayerState["bot_2"]
  }
 // logger.warn('TODO: 2222')

  return { state }
}

function onPlayerQuit(player, roomState) {
  const { logger } = roomState
  //logger.warn('TODO: implement how to change the roomState when a player quits the room')
  return {}
}

function onPlayerMove(player, move, roomState) {
  const { state, logger } = roomState;
  //logger.warn('TODO: implement how to change the roomState when any player makes a move')

  const status = state.status;
  const playerState = state.playerIdToPlayerState[player.id]

  //logger.warn('1111')
  switch (status) {
    case GameStatus.PrepGame:
      if (playerState.status == PlayerStatus.Login) {
        return onLoginMove(player, move, roomState);
      } else if (playerState.status == PlayerStatus.Lobby){ 
        return onLobbyMove(player, move, roomState);
      }
    case GameStatus.InGame:
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

 // logger.warn('TODO: 444')
  return { state };
}

function isPlayerMaster(roomState, player) { 
  const { state, players, logger } = roomState;

  return state.playerIdToPlayerState[player.id].isMaster
}
function onLobbyMove(player, move, roomState) {
  const { state, players, logger } = roomState;

  if (!isPlayerMaster(roomState, player)) {
    return {state}
  }
  
  if (move) {
    players.map((player) => { 
      player.status = PlayerStatus.InGame
    })
    // logger.info('onLobbyMove:')
    state.status = GameStatus.InGame
    state.gamePhase = GamePhase.PickStartingTile
    state.phaseTimerStart = new Date().getTime();
    state.phaseTimerTotal = CHOOSE_STARTING_POSITION_TIMEOUT
    chooseTileAndRemove(state, state.playerIdToPlayerState["bot_1"])
    chooseTileAndRemove(state, state.playerIdToPlayerState["bot_2"])
 
  }
  
  return { state };
}
function updatePlayerTotalValue(entity, state) { 
  let totalValue = 0
  entity.mapSections.forEach( (element) => {
    let value = 200
    // const section = state.mapConnectedSections[element-1]
    // if (section.status == TileStatus.ReTaken) {
    //   value = 300
    // }
    if (element != null) {
      totalValue += value
    }
  });
  entity.totalValue = totalValue
}
function chooseTileAndRemove(state, entity) { 
  // check if player/bot exist
  if (entity !== undefined) {
    var randomAvailableTile = getRandomItemFromArray(state.emptyMapSections)

    state.emptyMapSections = removeItem(state.emptyMapSections, randomAvailableTile)
    entity.mapSections.push(randomAvailableTile)
    updatePlayerTotalValue(entity, state)
  }
}
function chooseTileWithPlayer(roomState, player) { 
  const { state, players, logger } = roomState;

  
  var randomElements = getRandomNElementsFromArray(state.emptyMapSections, 2 - player.battleForTile.length)
  player.battleForTile = randomElements
}
function chooseTileWithBot(roomState, bot) { 
  const { state, players, logger } = roomState;
  var randomElements = getRandomNElementsFromArray(state.emptyMapSections, 2)
  bot.battleForTile = randomElements
}
function checkIfAllPlayersHaveSelectedTiles(roomState) { 
  const { state, players, logger } = roomState;
  Object.entries(state.playerIdToPlayerState).map(([k, player]) => { 
 
    if (!player.madePhaseAction && !player.isBot) {
      chooseTileAndRemove(state, player)
      player.madePhaseAction = true
    } 
  })
}
function resetPlayerPhaseAction(roomState) { 
  const { state, players, logger } = roomState;
  Object.entries(state.playerIdToPlayerState).map(([k, player]) => { 
      player.madePhaseAction = false
      player.answer = null
  })
}
function updateAllPlayersTotalValues(roomState) {
  const { state, players, logger } = roomState;
  Object.entries(state.playerIdToPlayerState).map(([k, player]) => { 
    updatePlayerTotalValue(player, state)
  })
}
function pickEmptyTileStageStart(roomState) { 
  const { state, players, logger } = roomState;
  checkIfAllPlayersHaveSelectedTiles(roomState)

  resetPlayerPhaseAction(roomState)
  const bot_1 = state.playerIdToPlayerState["bot_1"]
  if (bot_1 !== undefined) {
    chooseTileWithBot(roomState, bot_1)
  }
  const bot_2 = state.playerIdToPlayerState["bot_2"]
  if (bot_2 !== undefined) {
    chooseTileWithBot(roomState, bot_2)
  }
}
function pickEmptyTileStage(roomState) { 
  const { state, players, logger } = roomState;
  
  Object.entries(state.playerIdToPlayerState).map(([k, player]) => { 
    if (player.battleForTile.size < 2 && !player.isBot) {
      chooseTileWithPlayer(state, player)
      player.madePhaseAction = true
    } 
  })
  
  resetPlayerPhaseAction(roomState)
  const bot_1 = state.playerIdToPlayerState["bot_1"]
  if (bot_1 !== undefined) {
    chooseTileWithBot(roomState, bot_1)
  }
  const bot_2 = state.playerIdToPlayerState["bot_2"]
  if (bot_2 !== undefined) {
    chooseTileWithBot(roomState, bot_2)
  }
}

function onInGameMove(player, move, roomState) {
  const { state, players, logger } = roomState;
  //logger.info('onInGameMovey called with:', { player, move, state })

  const { InGameMoveStatusClient, data } = move
  // after the 1st ever round of picking a starting tile has ended
  if (InGameMoveStatus.PickStartingTileEnd == InGameMoveStatusClient) {
    if (!isPlayerMaster(roomState, player)) {
      return {state}
    }

    //logger.info('PickStartingTileEnd ')
    pickEmptyTileStageStart(roomState)
    logger.info("state : ", state.playerIdToPlayerState)
    state.gamePhase = GamePhase.PickEmptyTile
    state.phaseTimerStart = new Date().getTime();
    state.phaseTimerTotal = CHOOSE_EMPTY_TILE_TIMEOUT
    
  } else if (PlayerAction.PickTilePlayerAction == InGameMoveStatusClient 
    && state.gamePhase == GamePhase.PickStartingTile) {
    // picking a tile with player by clicking on it
    const playerState = state.playerIdToPlayerState[player.id]
    if (!state.emptyMapSections.includes(data.tile)) { // check if tile is available
      throw new Error("Tile is already picked")
    } 

    if (playerState.madePhaseAction) {
      throw new Error("A tile has already been chosen for this round!")
    }
    
    state.emptyMapSections = removeItem(state.emptyMapSections, data.tile)
    playerState.mapSections.push(data.tile)
    updatePlayerTotalValue(playerState, state)
    
    playerState.madePhaseAction = true
  } else if (PlayerAction.PickTilePlayerAction == InGameMoveStatusClient 
    && state.gamePhase == GamePhase.PickEmptyTile) { 
      const playerState = state.playerIdToPlayerState[player.id]
      if (playerState.battleForTile.length >= 2) {
        throw new Error("You have chosen enough tiles for this round!")
      }

      if (!state.emptyMapSections.includes(data.tile)) { // check if tile is available
        throw new Error("Choose an empty tile!")
      } 

      if (playerState.battleForTile.includes(data.tile)) {
        throw new Error("Choose a different tile!")
      }

      playerState.battleForTile.push(data.tile)

  } else if (InGameMoveStatus.PickEmptyTileEnd == InGameMoveStatusClient) { 
    if (!isPlayerMaster(roomState, player)) {
      return {state}
    }
    state.gamePhase = GamePhase.EmptyTileBattle
    state.phaseTimerStart = new Date().getTime();
    state.phaseTimerTotal = BATTLE_EMPTY_TILE_TIMEOUT
    state.question = getRandomItemFromArray(QUESTIONS_NUMBERS)

    
  } else if (PlayerAction.PickAnswerPlayerAction == InGameMoveStatusClient 
    && state.gamePhase == GamePhase.EmptyTileBattle) { 
      const playerState = state.playerIdToPlayerState[player.id]
      if (playerState.answer != null) {
        throw new Error("You have chosen an asnwer already!")
      }

      playerState.answer = data.answer
      playerState.timeAnswered = new Date().getTime()
  } else if (InGameMoveStatus.EmptyTileBattleEnd == InGameMoveStatusClient) { 
    if (!isPlayerMaster(roomState, player)) {
      return {state}
    }

    // creating bot answers
    createBotAnswersNumber(roomState)
    // should check for winners and give them the tiles
    emptyTileCorrectAnswers(roomState)
    state.gamePhase = GamePhase.ShowEmptyTileBattleAnswers
    state.phaseTimerStart = new Date().getTime();
    state.phaseTimerTotal = BATTLE_EMPTY_TILE_SHOW_ANSWERS_TIMEOUT

  } else if (InGameMoveStatus.ShowEmptyTileBattleAnswersEnd == InGameMoveStatusClient) {
    if (!isPlayerMaster(roomState, player)) {
      return {state}
    }

    // logger.info("state.emptyMapSections.length ", state.emptyMapSections.length)
    // logger.info("state.emptyMapSections ", state.emptyMapSections)
   
    fillTilesFromEmptyTileBattle(roomState)
    pickEmptyTileStage(roomState)
    updateAllPlayersTotalValues(roomState)
    if (state.emptyMapSections.length == 0) { // end of the empty tile pick battles should go to real battles
      state.gamePhase = GamePhase.PickTileToAttack
      state.phaseTimerStart = new Date().getTime();
      state.phaseTimerTotal = CHOOSE_TILE_TO_ATTACK_TIMEOUT
    } else { // loop until map filled
      state.gamePhase = GamePhase.PickEmptyTile
      state.phaseTimerStart = new Date().getTime();
      state.phaseTimerTotal = CHOOSE_EMPTY_TILE_TIMEOUT
    }
  } else if (PlayerAction.PickTileToAttackPlayerAction == InGameMoveStatusClient 
    && state.gamePhase == GamePhase.PickTileToAttack) { 
      const playerState = state.playerIdToPlayerState[player.id]

      if (playerState.type != state.tileAttackOrder[state.tileAttackRound]) {
        throw new Error("It is not your turn!")
      }

      if (playerState.tileAttackDefender != null) {
        throw new Error("You have already picked a tile to attack!")
      }

      if (playerState.mapSections.includes(data.tile)) {
        throw new Error("You need to pick enemy tile!")
      }

      state.tileAttackDefender = getPlayerFromTile(roomState, data.tile)
      state.tileAttackDefenderTile = data.tile
  
      // logger.info("PickTileToAttackPlayerAction : ", state.tileAttackDefender)
  } else if (InGameMoveStatus.PickTileToAttackEnd == InGameMoveStatusClient) {
    if (!isPlayerMaster(roomState, player)) {
      return {state}
    }

    const attackerId = getCurrentPlayerIdFromAttackOrder(roomState)
    if (state.tileAttackDefender == null) {
      // logger.info("PickTileToAttackPlayerAction tileAttackDefender null: ")
      const randomPlayerOpponentId = getRandomOpponentId(roomState, attackerId)
      const randomTileFromOpponent = getRandomTileFromPlayerById(roomState, randomPlayerOpponentId)
      state.tileAttackDefender  = randomPlayerOpponentId
      state.tileAttackDefenderTile = randomTileFromOpponent
    }
    // logger.info("PickTileToAttackPlayerAction tileAttackDefender not null: ", state.tileAttackDefender)

    state.gamePhase = GamePhase.PickTileToAttackBattle
    state.phaseTimerStart = new Date().getTime();
    state.phaseTimerTotal = ATTACK_BATTLE_TIMEOUT
    state.question = getRandomItemFromArray(QUESTIONS_PICK)

  } else if (PlayerAction.PickTileToAttackBattleAnswerPlayerAction == InGameMoveStatusClient 
    && state.gamePhase == GamePhase.PickTileToAttackBattle) { 
      const playerState = state.playerIdToPlayerState[player.id]
      
      if (playerState.type !== state.tileAttackOrder[state.tileAttackRound] && player.id !== state.tileAttackDefender) {
        throw new Error("It is not your battle!")
      }

      if (playerState.answer != null) {
        throw new Error("You have chosen an asnwer already!")
      }

      playerState.answer = data.answer
      playerState.timeAnswered = new Date().getTime()
  } else if (InGameMoveStatus.PickTileToAttackBattleEnd == InGameMoveStatusClient) { 
    if (!isPlayerMaster(roomState, player)) {
      return {state}
    }

    // creating bot answers
    createBotAnswersPick(roomState)
    // should check for winners and give them the tiles
    battleCorrectAnswers(roomState)
    state.gamePhase = GamePhase.ShowAnswersPickTileToAttackBattle
    state.phaseTimerStart = new Date().getTime();
    state.phaseTimerTotal = ATTACK_BATTLE_SHOW_ANSWERS_TIMEOUT

  } else if (InGameMoveStatus.ShowAnswersPickTileToAttackBattleEnd == InGameMoveStatusClient) {
    if (!isPlayerMaster(roomState, player)) {
      return {state}
    }

    updateWinner(roomState)
    updateAllPlayersTotalValues(roomState)
    resetBattleData(roomState)

    // end game
    if (state.tileAttackRound+1 == state.tileAttackOrder.length || checkIfOnlyOneSurvivor(roomState) == 1) {
      // logger.info("GamePhase.EndGame 1 ", state.tileAttackOrder.length)
      // logger.info("GamePhase.EndGame 2 ", checkIfOnlyOneSurvivor(roomState))
      // logger.info("GamePhase.EndGame 3 ", (state.tileAttackRound+1 == state.tileAttackOrder.length))
      state.gamePhase = GamePhase.EndGame
    } else {
      if (checkIfNextRoundShouldBeSkipped(roomState)) {
        state.tileAttackRound += 2
      } else {
        state.tileAttackRound++
      }
      state.gamePhase = GamePhase.PickTileToAttack
      state.phaseTimerStart = new Date().getTime();
      state.phaseTimerTotal = CHOOSE_TILE_TO_ATTACK_TIMEOUT
    }
  }

  return { state };
}
function checkIfNextRoundShouldBeSkipped(roomState) { 
  const { state, players, logger } = roomState;

  const nextRoundAttacker = state.playerIdToPlayerState[getCurrentPlayerIdFromNextAttackOrder(roomState, state.tileAttackRound+1)]

  if (nextRoundAttacker.mapSections.length ==  0 ) {
    return true
  }

  return false
}
function checkIfOnlyOneSurvivor(roomState) { 
  const { state, players, logger } = roomState;
  
  let surviors = 0
  Object.entries(state.playerIdToPlayerState).map(([playerId, player]) => { 
   
    if (player.mapSections.length > 0) {
      surviors++
    }
  })

  return surviors
}
function resetBattleData(roomState) { 
  const { state, players, logger } = roomState;

  resetPlayerPhaseAction(roomState)

  state.tileAttackDefender = null
  state.tileAttackDefenderTile = null
  state.answerPlacements = []
}
function updateWinner(roomState) { 
  const { state, players, logger } = roomState;

  if (state.answerPlacements.length > 0) {

    const attackerId = getCurrentPlayerIdFromAttackOrder(roomState)
    const defenderId = state.tileAttackDefender
    const attacker = state.playerIdToPlayerState[attackerId]
    const defender = state.playerIdToPlayerState[defenderId]

    const winnerId = state.answerPlacements[0]
    // for now only if the attacker wins we give him the tile 
    // nothing happens if the defender wins or if
    // logger.info("updateWinner attackerId : ", attackerId)
    // logger.info("updateWinner winnerId : ", winnerId)
    // logger.info("updateWinner state.tileAttackDefenderTile : ", state.tileAttackDefenderTile)
    if (attackerId == winnerId) {
      // remove the tile from the defender
      defender.mapSections = removeItem(defender.mapSections, state.tileAttackDefenderTile) 
      // add the tile to the winner
      attacker.mapSections.push(state.tileAttackDefenderTile)
    }
  }

}
function getRandomTileFromPlayerById(roomState, playerId) {
  const { state, players, logger } = roomState;
  const player = state.playerIdToPlayerState[playerId]

  return getRandomItemFromArray(player.mapSections)
}
function getCurrentPlayerIdFromNextAttackOrder(roomState, attackRound) { 
  const { state, players, logger } = roomState;

  let playerIdFromOrder = ""
  Object.entries(state.playerIdToPlayerState).map(([playerId, player]) => { 
    if (player.type == state.tileAttackOrder[attackRound]) {
      playerIdFromOrder =  playerId
    }
  })

  // logger.info("playerIdFromOrder : ", playerIdFromOrder)
  return playerIdFromOrder
}
function getCurrentPlayerIdFromAttackOrder(roomState) { 
  const { state, players, logger } = roomState;

  let playerIdFromOrder = ""
  Object.entries(state.playerIdToPlayerState).map(([playerId, player]) => { 
    if (player.type == state.tileAttackOrder[state.tileAttackRound]) {
      playerIdFromOrder =  playerId
    }
  })

  return playerIdFromOrder
}
function getRandomOpponentId(roomState, currentPlayerId) { 
  return getRandomItemFromArray(getOpponents(roomState, currentPlayerId))
}
function getOpponents(roomState, currentPlayerId) {
  const { state, players, logger } = roomState;
  let opponents = []
  Object.entries(state.playerIdToPlayerState).map(([playerId, player]) => { 
    if (currentPlayerId != playerId) {
      opponents.push(playerId)
    }
  })

  return opponents
}
function getPlayerFromTile(roomState, tile) {
  const { state, players, logger } = roomState;

  // logger.info("getPlayerFromTile tile : ", tile)
  let playerToReturn = null
  Object.entries(state.playerIdToPlayerState).map(([playerId, player]) => { 
    // logger.info("getPlayerFromTile player.mapSections : ", player.mapSections)
    if (player.mapSections.includes(tile)) {
      playerToReturn = playerId
      return playerToReturn
    }
  })
  // logger.info("getPlayerFromTile  playerToReturn : ", playerToReturn)
  return playerToReturn
}
function fillTilesFromEmptyTileBattle(roomState) { 
  const { state, players, logger } = roomState;

  const playerWinner1 = state.playerIdToPlayerState[state.answerPlacements[0]]
  const playerWinner2 = state.playerIdToPlayerState[state.answerPlacements[1]]
  const playerWinner3 = state.playerIdToPlayerState[state.answerPlacements[2]]

  fillBattleForTileElementsIfEmpty(playerWinner1, roomState, 1)

  if (state.emptyMapSections.includes(playerWinner1.battleForTile[0])) {
    state.emptyMapSections = removeItem(state.emptyMapSections, playerWinner1.battleForTile[0]) 
    playerWinner1.mapSections.push(playerWinner1.battleForTile[0])
  }

  if (playerWinner1.battleForTile.length == 2 && state.emptyMapSections.includes(playerWinner1.battleForTile[1])) {
    state.emptyMapSections = removeItem(state.emptyMapSections, playerWinner1.battleForTile[1])
    playerWinner1.mapSections.push(playerWinner1.battleForTile[1])
  }

  fillBattleForTileElementsIfEmpty(playerWinner2, roomState, 2)
  if (state.emptyMapSections.length >= 0) {
    // this can happen if both players have taken the same tiles and the 2nd winner is left with 0 in that case so we generate random one
    if (!state.emptyMapSections.includes(playerWinner2.battleForTile[0]) && !state.emptyMapSections.includes(playerWinner2.battleForTile[1])) {
      var randomAvailableTile = getRandomItemFromArray(state.emptyMapSections)

      state.emptyMapSections = removeItem(state.emptyMapSections, randomAvailableTile)
      playerWinner2.mapSections.push(randomAvailableTile)
    } else {
      if (state.emptyMapSections.includes(playerWinner2.battleForTile[0])) {
        state.emptyMapSections = removeItem(state.emptyMapSections, playerWinner2.battleForTile[0])
        playerWinner2.mapSections.push(playerWinner2.battleForTile[0])
      } else if (playerWinner1.battleForTile.length == 2){
        state.emptyMapSections = removeItem(state.emptyMapSections, playerWinner2.battleForTile[1])
        playerWinner2.mapSections.push(playerWinner2.battleForTile[1])
      }
    }
  }
  // reset
  resetPlayerAfterBatte(playerWinner1)
  resetPlayerAfterBatte(playerWinner2)
  resetPlayerAfterBatte(playerWinner3)

}
function fillBattleForTileElementsIfEmpty( player, roomState, placement) { 
  const { state, players, logger } = roomState;
  if (placement == 1) {
    if (player.battleForTile.length == 0) {
      var randomElements = getRandomNElementsFromArray(state.emptyMapSections, 2 - player.battleForTile.length)
      player.battleForTile = randomElements
    } else if (player.battleForTile.length == 1) {
      var randomElements = getRandomNElementsFromArray(state.emptyMapSections, 1)
      player.battleForTile = randomElements
    }
  } else {
    if (player.battleForTile.length == 0) {
      var randomElements = getRandomNElementsFromArray(state.emptyMapSections, 1)
      player.battleForTile = randomElements
    }
  }
}
function resetPlayerAfterBatte(player) { 
  player.battleForTile = []
  player.answer = null
  player.playerTimeAnswered = BATTLE_EMPTY_TILE_TIMEOUT
}

function emptyTileCorrectAnswers(roomState) { 
  const { state, players, logger } = roomState;
  let playersAnswers = []
  Object.entries(state.playerIdToPlayerState).map(([playerId, player]) => { 
   let playerAnswer = 0
   let playerTimeAnswered = BATTLE_EMPTY_TILE_TIMEOUT

   if (player.answer != null) {
    playerAnswer = player.answer
    playerTimeAnswered = player.timeAnswered
   } else {
    player.answer = playerAnswer
    player.timeAnswered = playerTimeAnswered
   }
   playersAnswers.push({
    answer: playerAnswer,
    timeAnswered: playerTimeAnswered,
    playerId: playerId
   })
  })

  const correctAnswer = state.question.correctAnswer
  const closest = playersAnswers.sort((a, b) => {
    if (Math.abs(b.answer - correctAnswer) < Math.abs(a.answer - correctAnswer)) {
        return 1;
    } else if (Math.abs(b.answer - correctAnswer) > Math.abs(a.answer - correctAnswer)) {
        return -1;
    }

    if (b.timeAnswered < a.timeAnswered) {
      return 1;
    } else if (b.timeAnswered > a.timeAnswered) {
      return -1;
    }

    return 0; // because they are equal in value and should have equal ordering
  })
 
  state.answerPlacements = [closest[0].playerId, closest[1].playerId, closest[2].playerId]
}

function battleCorrectAnswers(roomState) { 
  const { state, players, logger } = roomState;
 
  
  const attackerId = getCurrentPlayerIdFromAttackOrder(roomState)
  const attacker = state.playerIdToPlayerState[attackerId]
  const defender = state.playerIdToPlayerState[state.tileAttackDefender]
  
  // logger.info("battleCorrectAnswers attacker: ", attacker)
  // logger.info("battleCorrectAnswers defender: ", defender)
  if (attacker.answer == null && defender.answer == null) {
    state.answerPlacements = [] // no winner
  } else if (attacker.answer == state.question.correctAnswer && defender.answer != state.question.correctAnswer) {
    state.answerPlacements = [attackerId] // attacker wins
  } else if (defender.answer == state.question.correctAnswer && attacker.answer != state.question.correctAnswer)  { 
    state.answerPlacements = [defender] // defender wins
  } else {
    state.answerPlacements = [] // it's a tie no one wins for now
  }
  // logger.info("battleCorrectAnswers attacker.answer: ", attacker.answer)
  // logger.info("battleCorrectAnswers state.question.correctAnswer: ", state.question.correctAnswer)
  // logger.info("battleCorrectAnswers defender.answer: ", defender.answer)
  // logger.info("battleCorrectAnswers : ", state.answerPlacements)
}
function createBotAnswersPick(roomState) { 
  const { state, players, logger } = roomState;
  const attackerId = getCurrentPlayerIdFromAttackOrder(roomState)
  const attacker = state.playerIdToPlayerState[attackerId]
  const defender = state.playerIdToPlayerState[state.tileAttackDefender]

  // logger.info("attacker : ", attacker)
  // logger.info("defender : ", defender)
  if (attacker.isBot) {
    generateBotAnswersPick(roomState, attacker)
  }

  if (defender.isBot) {
    generateBotAnswersPick(roomState, defender)
  }
  // logger.info("attacker picked: ", attacker)
  // logger.info("defender picked: ", defender)
}

function generateBotAnswersPick(roomState, bot) { 
  const { state, players, logger } = roomState;
  const botTimeRange = randomIntFromInterval(state.botTimeRange[0],state.botTimeRange[1])
  if (randomIntFromInterval(0,100) < state.botDifficulty ) {
    bot.answer = state.question.correctAnswer
  } else {
    bot.answer = randomIntFromInterval(0,3)
  }
  bot.timeAnswered = new Date().getTime(); + botTimeRange
}
function createBotAnswersNumber(roomState) { 
  const { state, players, logger } = roomState;
  Object.entries(state.playerIdToPlayerState).map(([k, player]) => { 
    if (player.isBot) {
      const botTimeRange = randomIntFromInterval(state.botTimeRange[0],state.botTimeRange[1])
      if (state.question.type == 0) { // number
        const range = state.question.botRange
        player.answer = randomIntFromInterval(range[0],range[1])
        player.timeAnswered = new Date().getTime(); + botTimeRange
      } else { // pick
        if (randomIntFromInterval(0,100) < state.botDifficulty ) {
          player.answer = state.question.answer
        } else {
          player.answer = randomIntFromInterval(0,3)
        }
        player.timeAnswered = new Date().getTime(); + botTimeRange
      }
    } 
  })
}

// Export these functions so UrTurn runner can run these functions whenever the associated event
// is triggered. Follow an example flow of events: https://docs.urturn.app/docs/Introduction/Flow-Of-Simple-Game
export default {
  onRoomStart,
  onPlayerJoin,
  onPlayerQuit,
  onPlayerMove,
};
