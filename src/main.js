// tip: docs @ https://docs.urturn.app/docs/API/backend#functions

const GameStatus = Object.freeze({
  PrepGame: 'PrepGame',
  InGame: 'InGame',
});
const PlayerStatus = Object.freeze({
  Login: 'Login',
  Lobby: 'Lobby',
  InGame: 'InGame',
});

const DefaultPlayerState = {
  status: PlayerStatus.Login
}
// playerIdToPlayerState[id] = playerState 
// -- status -> Status

function onRoomStart(roomState) {
  const { logger } = roomState;
  logger.info('Start called')
  logger.warn('TODO: implement what the state of the room looks like initially')
  return {
    state: {
      status: GameStatus.PrepGame,
      playerIdToPlayerState: {}
    }
  }
}

function onPlayerJoin(player, roomState) {
  const { state, logger } = roomState
  logger.info('Join called with:', { player, state })
  logger.warn('TODO: implement how to change the roomState when a player joins')

  const playerState = state.playerIdToPlayerState[player.id]
  if (playerState === undefined) {
    state.playerIdToPlayerState[player.id] = DefaultPlayerState
  }

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
      return onInGameMove(player, move, roomState);
    default:
      throw new Error("Game got corrupted, with invalid 'roomState.state.status'. This should never happen, so contact developers.");
  }
}

function onLoginMove(player, move, roomState) {
  const { state, players, logger } = roomState;

  const { username } = move
  
  state.playerIdToPlayerState[player.id].status = PlayerStatus.Lobby
  return { state };
}
function onLobbyMove(player, move, roomState) {
  const { state, players, logger } = roomState;

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
