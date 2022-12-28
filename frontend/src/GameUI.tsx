import GameUIPlayer from "./GameUIPlayer";

function GameUI({playerIdToPlayerState}) {
  
  return (
    <div className="w-[200px] h-[220px] absolute top-0 left-0 ">
      <div className=" relative">
         {
            Object.entries(playerIdToPlayerState).map(([k, player]) => { 
              return (
                <GameUIPlayer player={player}/>
              );
            })
          }
          </div>
    </div>
  );
}
export default GameUI;
