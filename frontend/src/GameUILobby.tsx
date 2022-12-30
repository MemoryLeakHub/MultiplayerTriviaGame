import GameUILobbyPlayer from "./GameUILobbyPlayer";

function GameUILobby({playerIdToPlayerState, onStartGameClick, curPlayer}: {playerIdToPlayerState, onStartGameClick: any, curPlayer}) {

  console.log(playerIdToPlayerState)
  return (
    <div className="w-full h-full backdrop-blur-xl bg-white/30 relative ">
      <div className="flex h-[720px]">
        <div className="m-auto">
          {
            
            Object.entries(playerIdToPlayerState).map(([k, player]) => { 
              return (
                <GameUILobbyPlayer player={player}/>
              );
            })
          }
          {(Object.entries(playerIdToPlayerState).length === 3 && playerIdToPlayerState[curPlayer.id].isMaster) ? 
          <button type="button" className=" btn btn-hollow-play h-[47px] w-full mt-4" onClick={()=> {onStartGameClick()}} > START GAME </button>
            :
            <button type="button" className=" btn btn-hollow-not-ready h-[47px] w-full mt-4 cursor-not-allowed" disabled> START GAME </button>
          }
        </div>
      </div>
    </div>
  );
}
export default GameUILobby;
